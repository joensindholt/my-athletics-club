using MediatR;

namespace MyAthleticsClub.Api.Application.Features.Members.CreateMember
{
    public class CreateMemberRequest : IRequest<CreateMemberResponse>
    {
        public string Name { get; set; } = null!;
    }
}