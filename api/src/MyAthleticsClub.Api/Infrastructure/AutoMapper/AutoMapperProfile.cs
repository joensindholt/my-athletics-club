using AutoMapper;
using MyAthleticsClub.Api.ViewModels;

namespace MyAthleticsClub.Api.Infrastructure.AutoMapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            JwtOptionsReponse.CreateMap(this);
            JwtIssuerOptionsResponse.CreateMap(this);
            EmailOptionsResponse.CreateMap(this);
            SlackOptionsResponse.CreateMap(this);
        }
    }
}
