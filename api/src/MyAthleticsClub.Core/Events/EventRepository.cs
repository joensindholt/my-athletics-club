using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Core.Utilities;
using Newtonsoft.Json;

namespace MyAthleticsClub.Core.Events
{
    public class EventRepository : AzureStorageRepository<Event, EventEntity>, IEventRepository
    {
        public EventRepository(CloudStorageAccount account)
            : base(account, "events")
        {
        }

        public Task CreateAsync(Event _event)
        {
            _event.Title.VerifyNotNullOrWhiteSpace("event.Title");
            return CreateInternalAsync(_event);
        }

        public async Task<IEnumerable<Event>> GetAllByPartitionKey(string organizationId)
        {
            return (await GetAllByPartitionKeyInternalAsync(organizationId)).Where(e => !e.IsDeleted);
        }

        public Task<Event> GetAsync(string organizationId, string id)
        {
            return GetInternalAsync(organizationId, id);
        }

        public Task UpdateAsync(Event _event)
        {
            return UpdateInternalAsync(_event);
        }

        public async Task SoftDeleteAsync(string organizationId, string id)
        {
            var _event = await GetInternalAsync(organizationId, id);
            _event.IsDeleted = true;
            await UpdateInternalAsync(_event);
        }

        protected override Event ConvertEntityToObject(EventEntity entity)
        {
            var _event = new Event(
                entity.RowKey,
                entity.PartitionKey,
                entity.Title,
                entity.Date,
                entity.EndDate,
                entity.Address,
                entity.Link,
                entity.DisciplinesJson != null ? JsonConvert.DeserializeObject<List<EventDiscipline>>(entity.DisciplinesJson) : new List<EventDiscipline>(),
                entity.RegistrationPeriodStartDate,
                entity.RegistrationPeriodEndDate,
                entity.Info,
                entity.MaxDisciplinesAllowed.HasValue ? entity.MaxDisciplinesAllowed.Value : 3,
                entity.IsDeleted);

            return _event;
        }

        protected override EventEntity ConvertObjectToEntity(Event _event)
        {
            var entity = new EventEntity(
                _event.Id,
                _event.OrganizationId,
                _event.Title,
                _event.Date,
                _event.EndDate,
                _event.Address,
                _event.Disciplines != null ? JsonConvert.SerializeObject(_event.Disciplines) : null,
                _event.Link,
                _event.RegistrationPeriodStartDate,
                _event.RegistrationPeriodEndDate,
                _event.Info,
                _event.MaxDisciplinesAllowed,
                _event.IsDeleted);

            return entity;
        }
    }
}
