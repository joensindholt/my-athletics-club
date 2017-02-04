using System;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Api.Core.Authentication;
using MyAthleticsClub.Core.Repositories;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Utilities;
using Newtonsoft.Json;
using Serilog;

namespace MyAthleticsClub.Api
{
    public class Startup
    {
        private SymmetricSecurityKey _signingKey;

        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddUserSecrets()
                .AddEnvironmentVariables();

            Log.Logger = new LoggerConfiguration()
              .Enrich.FromLogContext()
              .WriteTo.File(Environment.GetEnvironmentVariable("HOME") + "\\logs\\log.txt")
              .CreateLogger();

            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();

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

            ConfigureJwtIssuerOptions(services);

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

            // Serilog: Ensure any buffered events are sent at shutdown
            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);

            ConfigureJwtAuthentication(app);

            app.UseCors("AllowAll");

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseMvc();
        }

        private void ConfigureJwtIssuerOptions(IServiceCollection services)
        {
            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));
            string secretKey = Configuration["JWT_TOKEN_KEY"];
            _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));
            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
                options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
            });
        }

        private void ConfigureJwtAuthentication(IApplicationBuilder app)
        {
            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                ValidateAudience = true,
                ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _signingKey,

                RequireExpirationTime = true,
                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };

            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                TokenValidationParameters = tokenValidationParameters
            });
        }

        private void ConfigureDepencyInjection(IServiceCollection services)
        {
            services.AddSingleton(_ => Configuration);

            var cloudStorageAccount = CloudStorageAccount.Parse(Configuration.GetConnectionString("AzureTableStorage"));
            services.AddSingleton(_ => cloudStorageAccount);

            // Services
            services.AddTransient<IEventService, EventService>();
            services.AddTransient<IEventRepository, EventRepository>();
            services.AddTransient<IEventRegistrationsExcelService, EventRegistrationsExcelService>();
            services.AddTransient<IRegistrationService, RegistrationService>();
            services.AddTransient<IRegistrationRepository, RegistrationRepository>();
            services.AddTransient<ISlackService, SlackService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IUserRepository, UserRepository>();

            // Repositories
            services.AddTransient<IUserRepository, UserRepository>();

            // Utilities
            services.AddTransient<IIdGenerator, IdGenerator>();
        }
    }
}
