using System.Collections.Generic;
using System.Linq;

namespace MyAthleticsClub.Api.Application.Features.Members.GetMembers
{
    public class GetMembersResponse
    {
        public GetMembersResponse(IEnumerable<Member> members)
        {
            Members = members;
        }

        public IEnumerable<Member> Members { get; } = Enumerable.Empty<Member>();

        public class Member
        {
            public Member(string name)
            {
                Name = name;
            }

            public string Name { get; }
        }
    }
}