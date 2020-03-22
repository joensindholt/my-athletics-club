using MyAthleticsClub.Api.Application.Features.Members.DataTansferObjects;

namespace MyAthleticsClub.Api.Application.Features.Members.CreateMember
{
    public class CreateMemberResponse
    {
        public CreateMemberResponse(MemberDto member)
        {
            Member = member;
        }

        public MemberDto Member { get; }
    }
}