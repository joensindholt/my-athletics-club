using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.StorageEntities
{
    public class MarsEventEntity : TableEntity
    {
        public string MeetId { get; set; }

        public string Title { get; set; }

        public string Link { get; set; }

        public string ResultsJson { get; set; }

        public MarsEventEntity()
        {
            ETag = "*";
        }

        public MarsEventEntity(
            string organizationId,
            string meetId,
            string title,
            string link,
            string resultsJson) : base(organizationId, meetId)
        {
            MeetId = meetId;
            Title = title;
            Link = link;
            ResultsJson = resultsJson;

            ETag = "*";
        }
    }
}
