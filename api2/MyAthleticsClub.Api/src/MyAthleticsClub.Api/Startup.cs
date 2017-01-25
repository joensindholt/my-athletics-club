using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Api.Core;

namespace MyAthleticsClub.Api
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc(options =>
            {
                var policy =
                    new AuthorizationPolicyBuilder()
                    .AddRequirements(new JwtTokenRequirement())
                        .Build();

                options.Filters.Add(new AuthorizeFilter(policy));
            });

            services.AddCors(options =>
            {
                var cors = new CorsPolicyBuilder(new CorsPolicy());
                cors.AllowAnyHeader();
                cors.AllowAnyMethod();
                cors.AllowAnyOrigin();
                cors.AllowCredentials();

                options.AddPolicy("AllowAll", cors.Build());
            });

            services.AddSingleton(_ => Configuration);
            services.AddTransient<Events.IEventService, Events.EventService>();
            services.AddTransient<Events.IRegistrationService, Events.RegistrationService>();
            services.AddTransient<Events.IRegistrationService, Events.RegistrationService>();
            services.AddTransient<Events.IEventRegistrationsExcelService, Events.EventRegistrationsExcelService>();
            services.AddTransient<SysEvents.ISysEventService, SysEvents.SysEventService>();
            services.AddTransient<Slack.ISlackService, Slack.SlackService>();
            services.AddTransient<Users.IUserService, Users.UserService>();
            services.AddTransient<Users.IUserRepository, Users.UserRepository>();
            services.AddTransient<Utilities.IIdGenerator, Utilities.IdGenerator>();
            services.AddSingleton<IAuthorizationHandler, JwtTokenRequirementHandler>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));

            loggerFactory.AddDebug();

            app.UseCors("AllowAll");

            app.UseMvc();
        }
    }
}