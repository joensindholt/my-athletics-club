using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Api.SysEvents
{
    public class SysEventEntity : TableEntity
    {
        public SysEventEntity()
        {
            ETag = "*";
        }

        public SysEventEntity(
            string id,
            string organizationId) : base(organizationId, id)
        {
            ETag = "*";
        }
    }
}