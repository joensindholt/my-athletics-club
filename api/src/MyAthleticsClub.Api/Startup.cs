using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using AutoMapper;
using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Api.Core.Authentication;
using MyAthleticsClub.Api.Infrastructure;
using MyAthleticsClub.Api.Infrastructure.Authentication;
using MyAthleticsClub.Api.Shared;
using MyAthleticsClub.Core.BackgroundJobs;
using MyAthleticsClub.Core.Email;
using MyAthleticsClub.Core.Enrollments;
using MyAthleticsClub.Core.Events;
using MyAthleticsClub.Core.MarsEvents;
using MyAthleticsClub.Core.Members;
using MyAthleticsClub.Core.Mocks;
using MyAthleticsClub.Core.Options;
using MyAthleticsClub.Core.Shared;
using MyAthleticsClub.Core.Slack;
using MyAthleticsClub.Core.Slug;
using MyAthleticsClub.Core.Subscriptions;
using MyAthleticsClub.Core.Users;
using MyAthleticsClub.Core.Utilities;
using Newtonsoft.Json;
using Serilog;
using Swashbuckle.AspNetCore.Swagger;
using WebApiContrib.Core.Formatter.Csv;

namespace MyAthleticsClub.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public IHostingEnvironment HostingEnvironment { get; }

        public Startup(IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            Configuration = configuration;
            HostingEnvironment = hostingEnvironment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();

            ConfigureAuthentication(services);
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Admin", policy => policy.RequireClaim("Role", "Admin"));
            });

            services.AddHangfire(config => config.UseMemoryStorage());

            services.AddMemoryCache();

            if (!HostingEnvironment.IsDevelopment())
            {
                services
                    .AddMvc(config =>
                    {
                        var policy = new AuthorizationPolicyBuilder()
                             .RequireAuthenticatedUser()
                             .Build();

                        config.Filters.Add(new AuthorizeFilter(policy));
                        config.Filters.Add(new BadRequestExceptionFilter());

                        //config.OutputFormatters.Add(new CsvOutputFormatter(new CsvFormatterOptions()));
                        //config.FormatterMappings.SetMediaTypeMappingForFormat("csv", MediaTypeHeaderValue.Parse("text/csv"));
                    })
                    .AddCsvSerializerFormatters();
            }
            else
            {
                services.AddMvc(config =>
                {
                    config.Filters.Add(new AllowAnonymousFilter());
                });
            }

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "My Athletics Club", Version = "v1" });
            });

            services.AddCors(config =>
            {
                var cors = new CorsPolicyBuilder(new CorsPolicy())
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
                    .AllowCredentials();

                config.AddPolicy("AllowAll", cors.Build());
            });

            ConfigureDepencyInjection(services);
        }

        public void Configure(IApplicationBuilder app,
                              IHostingEnvironment env,
                              ILoggerFactory loggerFactory,
                              IApplicationLifetime appLifetime,
                              IBackgroundJobService backgroundJobService)
        {
            loggerFactory
                .AddConsole(Configuration.GetSection("Logging"))
                .AddDebug()
                .AddAzureWebAppDiagnostics()
                .AddSerilog();

            app.UseCors("AllowAll");

            app.UseDefaultFiles();

            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = context =>
                {
                    if (context.File.Name == "index.html")
                    {
                        context.Context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
                        context.Context.Response.Headers["Pragma"] = "no-cache";
                        context.Context.Response.Headers["Expires"] = "0";
                    }
                }
            });

            app.UseHangfireServer(storage: new MemoryStorage());

            app.UseAuthentication();

            app.UseMvc();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My Athletics Club");
            });

            // Check that options have been properly initialized
            app.ApplicationServices.GetRequiredService<IOptions<EmailOptions>>().Value.Verify();
            app.ApplicationServices.GetRequiredService<IOptions<StorageOptions>>().Value.Verify();

            // Serilog: Ensure any buffered events are sent at shutdown
            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);

            // Configure recurring background event result parsing
            appLifetime.ApplicationStarted.Register(backgroundJobService.Initialize);

            LogStartupInformation(app.ApplicationServices, env);
        }

        private void ConfigureAuthentication(IServiceCollection services)
        {
            var jwtIssuerOptions = Configuration.GetSection(nameof(JwtIssuerOptions)).Get<JwtIssuerOptions>();
            var jwtOptions = Configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>();

            // Token issuing
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtOptions.TokenKey));

            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtIssuerOptions.Issuer;
                options.Audience = jwtIssuerOptions.Audience;
                options.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
                options.ValidFor = TimeSpan.FromDays(1);
            });

            // Authentication and authorization
            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtIssuerOptions.Issuer,

                        ValidateAudience = true,
                        ValidAudience = jwtIssuerOptions.Audience,

                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = signingKey,

                        RequireExpirationTime = true,
                        ValidateLifetime = true,

                        ClockSkew = TimeSpan.Zero
                    };
                });
        }

        private void ConfigureDepencyInjection(IServiceCollection services)
        {
            services.AddSingleton(Configuration);
            services.AddSingleton(CloudStorageAccount.Parse(Configuration.GetConnectionString("AzureTableStorage")));

            // Services
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IEmailTemplateProvider, EmbeddedEmailTemplateProvider>();
            services.AddScoped<IEnrollmentService, EnrollmentService>();
            services.AddScoped<IEventRegistrationsExcelService, EventRegistrationsExcelService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<IResultService, ResultService>();
            services.AddScoped<IMemberService, MemberService>();
            services.AddScoped<IRegistrationService, RegistrationService>();
            services.AddScoped<ISlackService, SlackService>();
            services.AddScoped<ISubscriptionService, SubscriptionService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ITemplateMerger, HandlebarsTemplateMerger>();
            services.AddScoped<IMarsEventService, MarsEventService>();
            services.AddScoped<IMarsParserFactory, MarsParserFactory>();

            if (HostingEnvironment.IsDevelopment())
            {
                services.AddScoped<IBackgroundJobService, BackgroundJobServiceMock>();
            }
            else
            {
                services.AddScoped<IBackgroundJobService, BackgroundJobService>();
            }

            // Repositories
            services.AddScoped<IEventRepository, EventRepository>();
            services.AddScoped<IResultRepository, ResultRepository>();
            services.AddScoped<IMemberRepository, MemberRepository>();
            services.AddScoped<IMemberMessageRepository, MemberMessageRepository>();
            services.AddScoped<IRegistrationRepository, RegistrationRepository>();
            services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
            services.AddScoped<ISubscriptionAccountRepository, SubscriptionAccountRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IMarsEventRepository, MarsEventRepository>();

            // Utilities
            services.AddScoped<IIdGenerator, IdGenerator>();
            services.AddScoped<ISlugGenerator, SlugGenerator>();
            services.AddAutoMapper();
            services.AddSingleton(new HttpClient());

            // We use mocked http responses when in development to avoid relying to much on 3rd party services being up
            if (HostingEnvironment.IsDevelopment())
            {
                services.AddSingleton<IHttpClientAdapter, MockedHttpClientAdapter>();
            }
            else
            {
                services.AddSingleton<IHttpClientAdapter, HttpClientAdapter>(provider => new HttpClientAdapter(new HttpClient()));
            }

            // Options configuration
            services.AddScoped<AdminConfigResponse, AdminConfigResponse>();
            services.Configure<AdminOptions>(Configuration.GetSection(nameof(AdminOptions)));
            services.Configure<EmailOptions>(Configuration.GetSection(nameof(EmailOptions)));
            services.Configure<StorageOptions>(Configuration.GetSection(nameof(StorageOptions)));
            services.Configure<EnrollmentOptions>(Configuration.GetSection(nameof(EnrollmentOptions)));
            services.Configure<JwtOptions>(Configuration.GetSection(nameof(JwtOptions)));
            services.Configure<SlackOptions>(Configuration.GetSection(nameof(SlackOptions)));
        }

        private void LogStartupInformation(IServiceProvider serviceProvider, IHostingEnvironment env)
        {
            var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
            using (var scope = scopeFactory.CreateScope())
            {
                Log.Logger.Information("-----------------------------");
                Log.Logger.Information("Application started");
                Log.Logger.Information("-----------------------------");

                Log.Logger.Information($"Hosting Environment: {env.EnvironmentName}");

                Log.Logger.Information("Storage connectionstring: {ConnectionString}", Configuration.GetConnectionString("AzureTableStorage"));

                Log.Logger.Information("Options:");
                Log.Logger.Information(JsonConvert.SerializeObject(scope.ServiceProvider.GetRequiredService<AdminConfigResponse>(), Formatting.Indented));

                Log.Logger.Information("Configuration:");
                foreach (var item in Configuration.AsEnumerable())
                {
                    Log.Logger.Information("- key: \"{Key}\", value: \"{Value}\"", item.Key, item.Value);
                }

                Log.Logger.Information("-----------------------------");
            }
        }
    }
}
