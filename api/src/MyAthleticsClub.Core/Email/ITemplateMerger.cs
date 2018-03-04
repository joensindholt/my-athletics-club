namespace MyAthleticsClub.Core.Email
{
    public interface ITemplateMerger
    {
        string Merge(string template, object data);
    }
}
