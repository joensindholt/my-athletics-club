using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace MyAthleticsClub.Api.WebApi.Features.OpenApi
{
    public static class OpenApiExtensions
    {
        public static void AddOpenApiWithUI(this IServiceCollection services)
        {
            services.AddOpenApiDocument(settings =>
            {
                settings.Title = "My Athletics Club";
            });
        }

        public static void UseOpenApiWithUI(this IApplicationBuilder builder)
        {
            builder.UseOpenApi();

            builder.UseSwaggerUi3(settings =>
            {
                settings.Path = "";
            });

            builder.UseReDoc(settings =>
            {
                settings.Path = "/redoc";
            });

        }
    }
}