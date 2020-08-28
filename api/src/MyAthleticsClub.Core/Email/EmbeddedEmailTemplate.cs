namespace MyAthleticsClub.Core.Email
{
    public class EmbeddedEmailTemplate : IEmailTemplate
    {
        public EmbeddedEmailTemplate(string subject, string resource)
        {
            Subject = subject;
            Resource = resource;
        }

        public string Subject { get; }

        public string Resource { get; }

        public string Content { get; set; }

        public string GetHtmlContent()
        {
            return Content;
        }

        public string GetSubject()
        {
            return Subject;
        }
    }
}
