using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.StorageEntities;
using MyAthleticsClub.Core.Utilities;
using Newtonsoft.Json;

namespace MyAthleticsClub.Core.Repositories
{
    public class EventRepository : AzureStorageRepository<Event, EventEntity>, IEventRepository
    {
        public EventRepository(CloudStorageAccount account)
            : base(account, "events")
        {
        }

        public override Task CreateAsync(Event _event)
        {
            _event.Title.VerifyNotNullOrWhiteSpace("event.Title");
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
