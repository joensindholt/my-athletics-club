

using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace ApiKeepAlive
{
    public class Startup : IWebJobsStartup
    {
        public Startup()
        {
            
            // Initialize serilog logger
            Log.Logger = new LoggerConfiguration()
                     .WriteTo.Console(Serilog.Events.LogEventLevel.Debug)
                     .WriteTo.ApplicationInsights(TelemetryConfiguration.Active, TelemetryConverter.Events)
                     .MinimumLevel.Debug()
                     .Enrich.FromLogContext()
                     .CreateLogger();
        }

        public void Configure(IWebJobsBuilder builder)
        {
            ConfigureServices(builder.Services).BuildServiceProvider(true);
        }

        private IServiceCollection ConfigureServices(IServiceCollection services)
        {
            services
                .AddLogging(builder => builder.AddSerilog(dispose: true))
                .AddHttpClient();

            return services;
        }
    }
}