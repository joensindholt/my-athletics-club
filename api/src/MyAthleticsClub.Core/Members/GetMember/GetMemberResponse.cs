using System.Collections.Generic;

namespace MyAthleticsClub.Core.Members.GetMember
{
    public class GetMemberResponse
    {
        public GetMemberResponse(Member member, IEnumerable<MemberMessage> messages)
        {
            Member = member;
            Messages = messages;
        }

        public Member Member { get; }

        public IEnumerable<MemberMessage> Messages { get; }
    }
}
