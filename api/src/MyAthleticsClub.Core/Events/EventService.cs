using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace MyAthleticsClub.Core.Events
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<EventService> _logger;

        public EventService(
            IEventRepository eventRepository,
            IMemoryCache memoryCache,
            ILogger<EventService> logger)
        {
            _eventRepository = eventRepository;
            _memoryCache = memoryCache;
            _logger = logger;
        }

        public async Task<IEnumerable<Event>> GetAllAsync(string organizationId)
        {
            if (!_memoryCache.TryGetValue(GetCacheKey(organizationId), out IEnumerable<Event> events))
            {
                _logger.LogInformation("Events not found in cache. Retrieving from data store");
                events = await _eventRepository.GetAllByPartitionKey(organizationId);
                _memoryCache.Set(GetCacheKey(organizationId), events);
            }

            return events;
        }

        public async Task<Event> GetAsync(string organizationId, string id)
        {
            if (!_memoryCache.TryGetValue(GetCacheKey(organizationId, id), out Event _event))
            {
                _logger.LogInformation($"Event '{id}' not found in cache. Retrieving from data store");
                _event = await _eventRepository.GetAsync(organizationId, id);
                _memoryCache.Set(GetCacheKey(organizationId, id), _event);
            }

            return _event;
        }

        public async Task CreateAsync(Event _event)
        {
            await _eventRepository.CreateAsync(_event);
            InvalidateCache(_event.OrganizationId, _event.Id);
        }

        public async Task UpdateAsync(Event _event)
        {
            await _eventRepository.UpdateAsync(_event);
            InvalidateCache(_event.OrganizationId, _event.Id);
        }

        public async Task SoftDeleteAsync(string organizationId, string id)
        {
            await _eventRepository.SoftDeleteAsync(organizationId, id);
            InvalidateCache(organizationId, id);
        }

        private string GetCacheKey(string organizationId, string id = null)
        {
            if (id == null)
            {
                return $"events_{organizationId}";
            }
            else
            {
                return $"events_{organizationId}_{id}";
            }
        }

        private void InvalidateCache(string organizationId, string id = null)
        {
            _memoryCache.Remove(GetCacheKey(organizationId));

            if (id != null)
            {
                _memoryCache.Remove(GetCacheKey(organizationId, id));
            }
        }
    }
}
