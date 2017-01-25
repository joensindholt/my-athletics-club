using Microsoft.Extensions.Configuration;

namespace MyAthleticsClub.Api.SysEvents
{
    public class SysEventService : AzureStorageService<SysEvent, SysEventEntity>, ISysEventService
    {
        public SysEventService(IConfigurationRoot configuration)
            : base(configuration, "sysevents")
        {
        }

        protected override SysEvent ConvertEntityToObject(SysEventEntity entity)
        {
            var _event = new SysEvent(
                entity.RowKey,
                entity.PartitionKey);

            return _event;
        }

        protected override SysEventEntity ConvertObjectToEntity(SysEvent _event)
        {
            var entity = new SysEventEntity(
                _event.Id,
                _event.OrganizationId);

            return entity;
        }
    }
}