using System;

namespace MyAthleticsClub.Core.Members
{
    public class MemberMessage : IEntityObject
    {
        public MemberMessage(string memberId, string to, string subject, string htmlContent, DateTime sent)
        {
            Id = Guid.NewGuid().ToString();
            MemberId = memberId;
            To = to;
            Subject = subject;
            HtmlContent = htmlContent;
            Sent = sent;
        }

        public string Id { get; }

        public string MemberId { get; }

        public string To { get; }

        public string Subject { get; }

        public string HtmlContent { get; }

        public DateTime Sent { get; }

        public string GetPartitionKey()
        {
            return MemberId;
        }

        public string GetRowKey()
        {
            return Id;
        }
    }
}
