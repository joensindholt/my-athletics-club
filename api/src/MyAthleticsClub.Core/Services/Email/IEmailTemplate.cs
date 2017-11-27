namespace MyAthleticsClub.Core.Services.Email
{
    public interface IEmailTemplate
    {
        string GetSubject();

        string GetHtmlContent();
    }
}
