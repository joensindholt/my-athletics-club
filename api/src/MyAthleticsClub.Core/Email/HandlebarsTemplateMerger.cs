using HandlebarsDotNet;

namespace MyAthleticsClub.Core.Email
{
    public class HandlebarsTemplateMerger : ITemplateMerger
    {
        public string Merge(string template, object data)
        {
            var result = Handlebars.Compile(template)(data);
            return result;
        }
    }
}
