using AutoMapper;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Api.Core.Authentication;
using MyAthleticsClub.Api.Infrastructure.Authentication;
using MyAthleticsClub.Core.Services;
using MyAthleticsClub.Core.Services.Email;
using Newtonsoft.Json;

namespace MyAthleticsClub.Api.ViewModels
{
    public class AdminConfigResponse
    {
        public object EmailOptions { get; }
        public object EnrollmentOptions { get; }
        public object JwtIssuerOptions { get; }
        public object JwtOptions { get; }
        public object SlackOptions { get; }

        public AdminConfigResponse(
            IOptions<EmailOptions> emailOptions,
            IOptions<EnrollmentOptions> enrollmentOptions,
            IOptions<JwtIssuerOptions> jwtIssuerOptions,
            IOptions<JwtOptions> jwtOptions,
            IOptions<SlackOptions> slackOptions)
        {
            EmailOptions = new
            {
                emailOptions.Value.Host,
                emailOptions.Value.Port,
                emailOptions.Value.UseSsl,
                emailOptions.Value.FromName,
                emailOptions.Value.FromEmail,
                emailOptions.Value.Username,
                Password = emailOptions.Value.Password.TakeFirstCharacters(5),
                emailOptions.Value.Enabled,
                emailOptions.Value.Templates,
                ApiKey = emailOptions.Value.ApiKey.TakeFirstCharacters(5)
            };

            EnrollmentOptions = new
            {
                enrollmentOptions.Value.Enabled,
                enrollmentOptions.Value.AdminEmail
            };

            JwtIssuerOptions = new
            {
                jwtIssuerOptions.Value.Issuer,
                jwtIssuerOptions.Value.Subject,
                jwtIssuerOptions.Value.Audience,
                jwtIssuerOptions.Value.NotBefore,
                jwtIssuerOptions.Value.IssuedAt,
                jwtIssuerOptions.Value.ValidFor
            };

            JwtOptions = new
            {
                TokenKey = jwtOptions.Value.TokenKey.TakeFirstCharacters(5)
            };

            SlackOptions = new
            {
                WebHookUrl = slackOptions.Value.WebHookUrl.RemoveLastTenCharacters()
            };
        }
    }

    public static class StringMapExtensions
    {
        public static string TakeFirstCharacters(this string input, int characters)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return input;
            }

            if (input.Length <= characters)
            {
                return input;
            }

            return input.Substring(0, characters) + "...";
        }

        public static string RemoveLastTenCharacters(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return input;
            }

            if (input.Length <= 10)
            {
                return input;
            }

            return input.Substring(0, input.Length - 10) + "...";
        }
    }
}
