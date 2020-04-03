namespace MyAthleticsClub.Core.Members.AddMember
{
    public class AddMemberResponse
    {
        public AddMemberResponse(Member member, bool welcomeMessageSent, bool welcomeMessageRegistered)
        {
            Member = member;
            WelcomeMessageSent = welcomeMessageSent;
            WelcomeMessageRegistered = welcomeMessageRegistered;
        }

        public Member Member { get; }

        public bool WelcomeMessageSent { get; }

        public bool WelcomeMessageRegistered { get; }
    }
}
