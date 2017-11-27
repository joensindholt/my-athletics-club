namespace MyAthleticsClub.Api.ViewModels
{
    public class SendEmailRequest
    {
        public string To { get; set; }

        public string TemplateId { get; set; }

        public object Data { get; set; }
    }
}
