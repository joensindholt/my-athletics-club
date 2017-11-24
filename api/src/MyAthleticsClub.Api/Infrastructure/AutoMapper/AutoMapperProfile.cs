using AutoMapper;
using MyAthleticsClub.Api.ViewModels;

namespace MyAthleticsClub.Api.Infrastructure.AutoMapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            EnrollmentOptionsResponse.CreateMap(this);
            EmailOptionsResponse.CreateMap(this);
            JwtIssuerOptionsResponse.CreateMap(this);
            JwtOptionsReponse.CreateMap(this);
            SlackOptionsResponse.CreateMap(this);
        }
    }
}
