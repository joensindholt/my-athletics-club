using Microsoft.Extensions.DependencyInjection;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MyAthleticsClub.Api.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    @"Server=(localdb)\mssqllocaldb;Database=EFProviders.InMemory;Trusted_Connection=True;ConnectRetryCount=0",
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            services.AddScoped<IApplicationDbContext>(provider => provider.GetService<ApplicationDbContext>());

            return services;
        }
    }
}