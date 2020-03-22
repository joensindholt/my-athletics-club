using MyAthleticsClub.Api.Application.Features.Members.DataTansferObjects;

namespace MyAthleticsClub.Api.Application.Features.Members.UpdateMember
{
    public partial class UpdateMemberResponse
    {
        public UpdateMemberResponse(MemberDto member)
        {
            Member = member;
        }

        public MemberDto Member { get; }
    }
}