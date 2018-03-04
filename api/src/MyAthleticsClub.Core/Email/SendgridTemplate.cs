using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace MyAthleticsClub.Core.Email
{
    public class SendGridTemplate : IEmailTemplate
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public List<Version> Versions { get; set; }

        public class Version
        {
            public bool Active { get; set; }

            [JsonProperty("html_content")]
            public string HtmlContent { get; set; }

            [JsonProperty("plain_content")]
            public string PlainContent { get; set; }

            public string Subject { get; set; }

            [JsonProperty("updated_at")]
            public DateTime UpdatedAt { get; set; }
        }

        #region IEmailTemplate

        public Version GetCurrentVersion()
        {
            return
                Versions
                    .Where(v => v.Active)
                    .OrderByDescending(v => v.UpdatedAt)
                    .First();
        }

        public string GetSubject() => GetCurrentVersion().Subject;

        public string GetHtmlContent() => GetCurrentVersion().HtmlContent;

        #endregion IEmailTemplate

        public static SendGridTemplate FromJson(string json)
        {
            var template = JsonConvert.DeserializeObject<SendGridTemplate>(json);

            if (template.Versions == null || !template.Versions.Any())
            {
                throw new Exception($"No versions found in the template json? Json: {json}");
            }

            return template;
        }
    }
}
