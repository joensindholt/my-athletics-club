using MediatR;

namespace MyAthleticsClub.Api.Application.Features.Members.CreateMember
{
    public class CreateMemberRequest : IRequest<CreateMemberResponse>
    {
        public CreateMemberRequest(string name)
        {
            Name = name;
        }

        public string Name { get; }
    }
}