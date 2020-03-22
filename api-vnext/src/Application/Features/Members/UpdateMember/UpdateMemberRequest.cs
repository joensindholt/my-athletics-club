using MediatR;

namespace MyAthleticsClub.Api.Application.Features.Members.UpdateMember
{
    public class UpdateMemberRequest : IRequest<UpdateMemberResponse>
    {
        public string Id { get; set; } = null!;

        public string Name { get; set; } = null!;
    }
}