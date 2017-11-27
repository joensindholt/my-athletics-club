namespace MyAthleticsClub.Core.Services.Email
{
    public interface ITemplateMerger
    {
        string Merge(string template, object data);
    }
}
