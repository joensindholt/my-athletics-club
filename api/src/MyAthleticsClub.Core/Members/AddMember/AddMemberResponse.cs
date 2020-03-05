namespace MyAthleticsClub.Core.Members.AddMember
{
    public class AddMemberResponse
    {
        public AddMemberResponse(Member member)
        {
            Member = member;
        }

        public Member Member { get; }
    }
}
