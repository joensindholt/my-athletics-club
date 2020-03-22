using System.Collections.Generic;
using System.Linq;
using MyAthleticsClub.Api.Application.Features.Members.DataTansferObjects;

namespace MyAthleticsClub.Api.Application.Features.Members.GetMembers
{
    public class GetMembersResponse
    {
        public GetMembersResponse(IEnumerable<MemberDto> members)
        {
            Members = members;
        }

        public IEnumerable<MemberDto> Members { get; } = Enumerable.Empty<MemberDto>();
    }
}