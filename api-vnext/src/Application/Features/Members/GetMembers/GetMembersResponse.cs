using System.Collections.Generic;

namespace MyAthleticsClub.Api.Application.Features.Members.GetMembers
{
    public class GetMembersResponse
    {
        public IEnumerable<Member> Members { get; set; }

        public class Member
        {
            public string Name { get; set; }
        }
    }
}