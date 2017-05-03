using Slugify;

namespace MyAthleticsClub.Core.Slug
{
    public class SlugGenerator : ISlugGenerator
    {
        public string GenerateSlug(string input, int slugKey)
        {
            var slug = new SlugHelper().GenerateSlug(input);

            if (slugKey != 0)
            {
                slug += "-" + slugKey;
            }

            return slug;
        }
    }
}
