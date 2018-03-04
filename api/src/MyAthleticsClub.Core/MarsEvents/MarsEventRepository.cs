using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json;

namespace MyAthleticsClub.Core.MarsEvents
{
    public class MarsEventRepository : AzureStorageRepository<MarsEvent, MarsEventEntity>, IMarsEventRepository
    {
        private const string CacheKey = "events";

        private readonly IMemoryCache _memoryCache;

        public MarsEventRepository(
            CloudStorageAccount account,
            IMemoryCache memoryCache)
            : base(account, "marsevents")
        {
            _memoryCache = memoryCache;
        }

        public async Task AddEventsAsync(IEnumerable<MarsEvent> events, CancellationToken cancellationToken)
        {
            if (events == null || !events.Any())
            {
                return;
            }

            foreach (var @event in events)
            {
                await CreateInternalAsync(@event);
                cancellationToken.ThrowIfCancellationRequested();
            }

            _memoryCache.Remove(CacheKey);
            _memoryCache.Set(CacheKey, await GetAllEventsAsync("gik", cancellationToken));
        }

        public async Task<IEnumerable<MarsEvent>> GetAllEventsAsync(string organizationId, CancellationToken cancellationToken)
        {
            if (!_memoryCache.TryGetValue(CacheKey, out IEnumerable<MarsEvent> events))
            {
                events = await GetAllByPartitionKeyInternalAsync(organizationId);
                _memoryCache.Set(CacheKey, @events);
            }

            return events;
        }

        public async Task<MarsEvent> GetLastRetrievedEventAsync(string organizationId, string parser, CancellationToken cancellationToken)
        {
            var events = await GetAllEventsAsync(organizationId, cancellationToken);

            if (parser != null)
            {
                events = events.Where(e => e.Parser == parser);
            }

            var lastEvent = events.OrderByDescending(e => e.GetDate()).FirstOrDefault();

            return lastEvent;
        }

        protected override MarsEvent ConvertEntityToObject(MarsEventEntity entity)
        {
            return new MarsEvent(
                entity.MeetId,
                entity.Title,
                entity.Link,
                JsonConvert.DeserializeObject<IEnumerable<MarsEvent.Result>>(entity.ResultsJson),
                entity.Parser);
        }

        protected override MarsEventEntity ConvertObjectToEntity(MarsEvent model)
        {
            return new MarsEventEntity(
                "gik",
                model.MeetId,
                model.Title,
                model.Link,
                JsonConvert.SerializeObject(model.Results),
                model.Parser);
        }
    }
}
