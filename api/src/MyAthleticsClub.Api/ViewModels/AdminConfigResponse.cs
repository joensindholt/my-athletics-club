using System;
using AutoMapper;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Api.Core.Authentication;
using MyAthleticsClub.Api.Infrastructure.Authentication;
using MyAthleticsClub.Api.Infrastructure.AutoMapper;
using MyAthleticsClub.Core.Services;

namespace MyAthleticsClub.Api.ViewModels
{
    public class AdminConfigResponse
    {
        private readonly IMapper _autoMapper;

        public JwtOptionsReponse Jwt { get; }
        public JwtIssuerOptionsResponse JwtIssuer { get; }
        public EmailOptionsResponse Email { get; }
        public SlackOptionsResponse Slack { get; }

        public AdminConfigResponse(
            IMapper autoMapper,
            IOptions<JwtIssuerOptions> jwtIssuerOptions,
            IOptions<EmailOptions> emailOptions,
            IOptions<SlackOptions> slackOptions,
            IOptions<JwtOptions> jwtOptions)
        {
            _autoMapper = autoMapper;

            JwtIssuer = _autoMapper.Map<JwtIssuerOptionsResponse>(jwtIssuerOptions.Value);
            Email = _autoMapper.Map<EmailOptionsResponse>(emailOptions.Value);
            Slack = _autoMapper.Map<SlackOptionsResponse>(slackOptions.Value);
            Jwt = _autoMapper.Map<JwtOptionsReponse>(jwtOptions.Value);
        }
    }

    public class JwtOptionsReponse
    {
        public string TokenKey { get; set; }

        public static void CreateMap(AutoMapperProfile profile)
        {
            profile.CreateMap<JwtOptions, JwtOptionsReponse>()
                .ForMember(dest => dest.TokenKey, opt => opt.AddTransform(m => m.TakeFirst3Characters()));
        }
    }

    public class SlackOptionsResponse
    {
        public string WebHookUrl { get; set; }

        public static void CreateMap(AutoMapperProfile profile)
        {
            profile.CreateMap<SlackOptions, SlackOptionsResponse>()
                .ForMember(
                    dest => dest.WebHookUrl,
                    opt => opt.AddTransform(m => m.RemoveLastTenCharacters()));
        }
    }

    public class JwtIssuerOptionsResponse
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public TimeSpan ValidFor { get; set; }

        public static void CreateMap(AutoMapperProfile profile)
        {
            profile.CreateMap<JwtIssuerOptions, JwtIssuerOptionsResponse>();
        }
    }

    public class EmailOptionsResponse
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSsl { get; set; } = true;
        public string FromName { get; set; }
        public string FromEmail { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool Enabled { get; set; }

        public static void CreateMap(AutoMapperProfile profile)
        {
            profile.CreateMap<EmailOptions, EmailOptionsResponse>()
                .ForMember(dest => dest.Username, opt => opt.AddTransform(m => m.TakeFirst3Characters()))
                .ForMember(dest => dest.Password, opt => opt.AddTransform(m => m.TakeFirst3Characters()));
        }
    }

    public static class StringMapExtensions
    {
        public static string TakeFirst3Characters(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return input;
            }

            if (input.Length <= 3)
            {
                return input;
            }

            return input.Substring(0, 3) + "...";
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
