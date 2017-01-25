using Microsoft.Extensions.Configuration;
using MyAthleticsClub.Api.Utilities;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Events
{
    public class EventService : AzureStorageService<Event, EventEntity>, IEventService
    {
        public EventService(IConfigurationRoot configuration)
            : base(configuration, "events")
        {
        }

        public override Task CreateAsync(Event _event)
        {
            _event.Title.VerifyNotNullOrWhiteSpace();
            return base.CreateAsync(_event);
        }

        protected override Event ConvertEntityToObject(EventEntity entity)
        {
            var _event = new Event(
                entity.RowKey,
                entity.PartitionKey,
                entity.Title,
                entity.Date,
                entity.Address,
                entity.Link,
                entity.DisciplinesJson != null ? JsonConvert.DeserializeObject<List<EventDiscipline>>(entity.DisciplinesJson) : new List<EventDiscipline>(),
                entity.RegistrationPeriodStartDate,
                entity.RegistrationPeriodEndDate,
                entity.Info);

            return _event;
        }

        protected override EventEntity ConvertObjectToEntity(Event _event)
        {
            var entity = new EventEntity(
                _event.Id,
                _event.OrganizationId,
                _event.Title,
                _event.Date,
                _event.Address,
                _event.Disciplines != null ? JsonConvert.SerializeObject(_event.Disciplines) : null,
                _event.Link,
                _event.RegistrationPeriodStartDate,
                _event.RegistrationPeriodEndDate,
                _event.Info);

            return entity;
        }
    }
}