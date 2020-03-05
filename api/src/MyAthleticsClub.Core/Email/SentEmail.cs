using System;
using System.Collections.Generic;

namespace MyAthleticsClub.Core.Email
{
    public class SentEmail
    {
        public SentEmail(IEnumerable<string> to, string subject, string htmlContent, DateTime sent)
        {
            To = to;
            Subject = subject;
            HtmlContent = htmlContent;
            Sent = sent;
        }

        public IEnumerable<string> To { get; }

        public string Subject { get; }

        public string HtmlContent { get; }

        public DateTime Sent { get; }
    }
}
