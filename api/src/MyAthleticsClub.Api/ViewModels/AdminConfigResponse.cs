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
        private readonly IMapper _autoMapper;

        public EmailOptions EmailOptions { get; }
        public EnrollmentOptions EnrollmentOptions { get; }
        public JwtIssuerOptions JwtIssuerOptions { get; }
        public JwtOptions JwtOptions { get; }
        public SlackOptions SlackOptions { get; }

        public AdminConfigResponse(
            IMapper autoMapper,
            IOptions<EmailOptions> emailOptions,
            IOptions<EnrollmentOptions> enrollmentOptions,
            IOptions<JwtIssuerOptions> jwtIssuerOptions,
            IOptions<JwtOptions> jwtOptions,
            IOptions<SlackOptions> slackOptions)
        {
            _autoMapper = autoMapper;

            EmailOptions = _autoMapper.Map<EmailOptions>(emailOptions.Value);
            EmailOptions.Password = EmailOptions.Password.TakeFirstCharacters(3);

            EnrollmentOptions = _autoMapper.Map<EnrollmentOptions>(enrollmentOptions.Value);

            JwtIssuerOptions = _autoMapper.Map<JwtIssuerOptions>(jwtIssuerOptions.Value);

            JwtOptions = _autoMapper.Map<JwtOptions>(jwtOptions.Value);
            JwtOptions.TokenKey = JwtOptions.TokenKey.TakeFirstCharacters(3);

            SlackOptions = _autoMapper.Map<SlackOptions>(slackOptions.Value);
            SlackOptions.WebHookUrl = SlackOptions.WebHookUrl.RemoveLastTenCharacters();
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
