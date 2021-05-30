using Amazon;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MyAthleticsClub.Api.Infrastructure.S3
{
    public static class AwsServiceCollectionExtensions
    {
        public static IServiceCollection AddAwsServices(this IServiceCollection services, IConfiguration configuration)
        {
            var options = new CredentialProfileOptions
            {
                AccessKey = configuration["AWS:AccessKey"],
                SecretKey = configuration["AWS:SecretKey"]
            };

            var profile = new CredentialProfile("shared_profile", options);
            profile.Region = RegionEndpoint.GetBySystemName(configuration["AWS:Region"]);

            var sharedFile = new SharedCredentialsFile();
            sharedFile.RegisterProfile(profile);

            services.AddDefaultAWSOptions(configuration.GetAWSOptions());
            services.AddAWSService<IAmazonS3>();

            return services;
        }
    }
}
