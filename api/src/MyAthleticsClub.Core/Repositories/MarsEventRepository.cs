using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.StorageEntities;
using Newtonsoft.Json;

namespace MyAthleticsClub.Core.Repositories
{
    public class MarsEventRepository : AzureStorageRepository<MarsEvent, MarsEventEntity>, IMarsEventRepository
    {
        public MarsEventRepository(CloudStorageAccount account)
            : base(account, "marsevents")
        {
        }

        public async Task AddEventsAsync(IEnumerable<MarsEvent> results, CancellationToken cancellationToken)
        {
            foreach (var result in results)
            {
                await base.CreateAsync(result);
                cancellationToken.ThrowIfCancellationRequested();
            }
        }

        public async Task<IEnumerable<MarsEvent>> GetAllEventsAsync(string organizationId, CancellationToken cancellationToken)
        {
            return await base.GetAllByPartitionKey(organizationId);
        }

        public async Task<MarsEvent> GetLastRetrievedEventAsync(string organizationId, CancellationToken cancellationToken)
        {
            var events = await base.GetAllByPartitionKey(organizationId);
            var lastEvent = events.OrderByDescending(e => e.GetDate()).FirstOrDefault();
            return lastEvent;
        }

        protected override MarsEvent ConvertEntityToObject(MarsEventEntity entity)
        {
            return new MarsEvent(
                entity.MeetId,
                entity.Title,
                entity.Link,
                JsonConvert.DeserializeObject<IEnumerable<MarsEvent.Result>>(entity.ResultsJson));
        }

        protected override MarsEventEntity ConvertObjectToEntity(MarsEvent model)
        {
            return new MarsEventEntity(
                "gik",
                model.MeetId,
                model.Title,
                model.Link,
                JsonConvert.SerializeObject(model.Results));
        }
    }
}
