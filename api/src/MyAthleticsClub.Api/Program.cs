using System;
using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace MyAthleticsClub.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
              .Enrich.FromLogContext()
              .WriteTo.RollingFile(ResolveLogFilePath())
              .WriteTo.Console()
              .CreateLogger();

            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseSerilog()
                .ConfigureAppConfiguration((hostContext, config) =>
                {
                    config.AddEnvironmentVariables("MyAthleticsClub_");
                })
                .Build();

        private static string ResolveLogFilePath()
        {
            var home = Environment.GetEnvironmentVariable("HOME");
            var homePath = Environment.GetEnvironmentVariable("HOMEPATH");

            var path = home ?? homePath;

            return Path.Combine(homePath, "logs", "log-{Date}.txt");
        }
    }
}
