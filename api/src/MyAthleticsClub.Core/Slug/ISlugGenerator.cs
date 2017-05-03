namespace MyAthleticsClub.Core.Slug
{
    public interface ISlugGenerator
    {
        string GenerateSlug(string name, int slugKey);
    }
}
