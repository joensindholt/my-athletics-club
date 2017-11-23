using System;
using System.Text;
using AutoMapper;
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
using MyAthleticsClub.Api.Infrastructure.AutoMapper;
using MyAthleticsClub.Api.ViewModels;
using MyAthleticsClub.Core.Repositories;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Slug;
using MyAthleticsClub.Core.Utilities;
using Serilog;
using Swashbuckle.AspNetCore.Swagger;

namespace MyAthleticsClub.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            Log.Logger = new LoggerConfiguration()
              .Enrich.FromLogContext()
              .WriteTo.File(Environment.GetEnvironmentVariable("HOME") + "\\logs\\log.txt")
              .CreateLogger();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();

            ConfigureAuthentication(services);

            services.AddAuthorization(options =>
            {
                options.AddPolicy("Admin", policy => policy.RequireClaim("Role", "Admin"));
            });

            services.AddMvc(config =>
            {
                var policy = new AuthorizationPolicyBuilder()
                     .RequireAuthenticatedUser()
                     .Build();

                config.Filters.Add(new AuthorizeFilter(policy));
                config.Filters.Add(new BadRequestExceptionFilter());
            });

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
                              IApplicationLifetime appLifetime)
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

            app.UseAuthentication();
            app.UseMvc();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My Athletics Club");
            });

            // Check that options have been properly initialized
            app.ApplicationServices.GetRequiredService<IOptions<EmailOptions>>().Value.Verify();

            // Serilog: Ensure any buffered events are sent at shutdown
            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);
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
            services.AddScoped<IEnrollmentService, EnrollmentService>();
            services.AddScoped<IEventRegistrationsExcelService, EventRegistrationsExcelService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<IMemberService, MemberService>();
            services.AddScoped<IRegistrationService, RegistrationService>();
            services.AddScoped<ISlackService, SlackService>();
            services.AddScoped<IUserService, UserService>();

            // Repositories
            services.AddScoped<IEventRepository, EventRepository>();
            services.AddScoped<IMemberRepository, MemberRepository>();
            services.AddScoped<IRegistrationRepository, RegistrationRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            // Utilities
            services.AddScoped<IIdGenerator, IdGenerator>();
            services.AddScoped<ISlugGenerator, SlugGenerator>();
            services.AddSingleton<AutoMapper.IConfigurationProvider>(new MapperConfiguration(cfg => cfg.AddProfile<AutoMapperProfile>()));
            services.AddScoped<IMapper>(s => new Mapper(s.GetRequiredService<AutoMapper.IConfigurationProvider>()));

            // Options configuration
            services.AddScoped<AdminConfigResponse, AdminConfigResponse>();
            services.Configure<EmailOptions>(Configuration.GetSection(nameof(EmailOptions)));
            services.Configure<EnrollmentOptions>(Configuration.GetSection(nameof(EnrollmentOptions)));
            services.Configure<JwtOptions>(Configuration.GetSection(nameof(JwtOptions)));
            services.Configure<SlackOptions>(Configuration.GetSection(nameof(SlackOptions)));
        }
    }
}
