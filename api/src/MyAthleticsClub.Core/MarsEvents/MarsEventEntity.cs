using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.MarsEvents
{
    public class MarsEventEntity : TableEntity
    {
        public string MeetId { get; set; }

        public string Title { get; set; }

        public string Link { get; set; }

        public string ResultsJson { get; set; }

        /// <summary>
        /// The parser with which the event was found (MarsNet, IMars, ...)
        /// </summary>
        public string Parser { get; set; }

        public MarsEventEntity()
        {
            ETag = "*";
        }

        public MarsEventEntity(
            string organizationId,
            string meetId,
            string title,
            string link,
            string resultsJson,
            string parser) : base(organizationId, meetId)
        {
            MeetId = meetId;
            Title = title;
            Link = link;
            ResultsJson = resultsJson;
            Parser = parser;

            ETag = "*";
        }
    }
}
