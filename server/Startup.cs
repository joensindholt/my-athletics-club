using System;
using System.Diagnostics;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace MyAthleticsClub.Server
{
    public class Startup : IWebJobsStartup
    {
        public Startup()
        {
            Console.WriteLine("Starting");
        }

        public void Configure(IWebJobsBuilder builder)
        {
            ConfigureServices(builder.Services).BuildServiceProvider(true);
        }

        private IServiceCollection ConfigureServices(IServiceCollection services)
        {
            services.AddHttpClient();
            return services;
        }
    }
}