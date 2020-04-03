namespace MyAthleticsClub.Core.Members.AddMember
{
    public class AddMemberRequest
    {
        public AddMemberRequest()
        {
            WelcomeMessage = new WelcomeMessageInfo();
        }

        public Member Member { get; set; }

        public WelcomeMessageInfo WelcomeMessage { get; set; }

        public class WelcomeMessageInfo
        {
            public bool Send { get; set; }

            public string Subject { get; set; }

            public string Template { get; set; }
        }
    }
}
