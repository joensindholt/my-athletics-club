using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.Members
{
    public class MemberMessageEntity : TableEntity
    {
        public string Id { get; set; }

        public string MemberId { get; set; }

        public string To { get; set; }

        public string Subject { get; set; }

        public string HtmlContent { get; set; }

        public DateTime Sent { get; set; }

        public MemberMessageEntity()
        {
            ETag = "*";
        }

        public MemberMessageEntity(
            string id,
            string memberId,
            string to,
            string subject,
            string htmlContent,
            DateTime sent)
            : base(memberId, id)
        {
            Id = id;
            MemberId = memberId;
            To = to;
            Subject = subject;
            HtmlContent = htmlContent;
            Sent = sent;

            ETag = "*";
        }
    }
}
