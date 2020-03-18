using Microsoft.Extensions.DependencyInjection;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MyAthleticsClub.Api.Infrastructure.AzureTableStorage;
using Microsoft.WindowsAzure.Storage;

namespace MyAthleticsClub.Api.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddSingleton<CloudStorageAccount>(provider =>
                CloudStorageAccount.Parse("UseDevelopmentStorage=true"));

            services.AddSingleton<IAzureTableStorageRepository, AzureTableStorageRepository>();

            services.AddSingleton<IApplicationDbContext>(provider =>
            {
                var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("Fake");

                var dbContext = new ApplicationDbContext(
                    optionsBuilder.Options,
                    provider.GetService<IAzureTableStorageRepository>());

                dbContext.Initialize().Wait();

                return dbContext;
            });

            return services;
        }
    }
}