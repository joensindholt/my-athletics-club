using System.Collections.Generic;

namespace MyAthleticsClub.Core.Members.GetWelcomeMessageTemplates
{
    public class GetWelcomeMessageTemplatesResponse
    {
        public Dictionary<string, string> Templates { get; set; } = new Dictionary<string, string>();
    }
}
