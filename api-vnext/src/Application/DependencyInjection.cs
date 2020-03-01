using System.Reflection;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using MyAthleticsClub.Api.Application.Common.Behaviours;

namespace MyAthleticsClub.Api.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestValidationBehavior<,>));

            return services;
        }
    }
}