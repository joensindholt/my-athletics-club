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

        public EmailOptionsResponse Email { get; }
        public EnrollmentOptionsResponse Enrollment { get; }
        public JwtIssuerOptionsResponse JwtIssuer { get; }
        public JwtOptionsReponse Jwt { get; }
        public SlackOptionsResponse Slack { get; }

        public AdminConfigResponse(
            IMapper autoMapper,
            IOptions<EmailOptions> emailOptions,
            IOptions<EnrollmentOptions> enrollmentOptions,
            IOptions<JwtIssuerOptions> jwtIssuerOptions,
            IOptions<JwtOptions> jwtOptions,
            IOptions<SlackOptions> slackOptions)
        {
            _autoMapper = autoMapper;

            Email = _autoMapper.Map<EmailOptionsResponse>(emailOptions.Value);
            Enrollment = _autoMapper.Map<EnrollmentOptionsResponse>(enrollmentOptions.Value);
            JwtIssuer = _autoMapper.Map<JwtIssuerOptionsResponse>(jwtIssuerOptions.Value);
            Jwt = _autoMapper.Map<JwtOptionsReponse>(jwtOptions.Value);
            Slack = _autoMapper.Map<SlackOptionsResponse>(slackOptions.Value);
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
                .ForMember(dest => dest.Username, opt => opt.AddTransform(m => m.TakeFirstCharacters(3)))
                .ForMember(dest => dest.Password, opt => opt.AddTransform(m => m.TakeFirstCharacters(6)));
        }
    }

    public class EnrollmentOptionsResponse
    {
        public bool Enabled { get; set; }

        public static void CreateMap(AutoMapperProfile profile)
        {
            profile.CreateMap<EnrollmentOptions, EnrollmentOptionsResponse>();
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

    public class JwtOptionsReponse
    {
        public string TokenKey { get; set; }

        public static void CreateMap(AutoMapperProfile profile)
        {
            profile.CreateMap<JwtOptions, JwtOptionsReponse>()
                .ForMember(dest => dest.TokenKey, opt => opt.AddTransform(m => m.TakeFirstCharacters(3)));
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
