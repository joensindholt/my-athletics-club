namespace MyAthleticsClub.Core.Email
{
    public interface IEmailTemplate
    {
        string GetSubject();

        string GetHtmlContent();
    }
}
