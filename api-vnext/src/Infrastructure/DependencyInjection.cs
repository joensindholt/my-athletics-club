using Microsoft.Extensions.DependencyInjection;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Infrastructure.Persistence;

namespace MyAthleticsClub.Api.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddTransient<IApplicationDbContext, ApplicationDbContext>();
            return services;
        }

    }
}