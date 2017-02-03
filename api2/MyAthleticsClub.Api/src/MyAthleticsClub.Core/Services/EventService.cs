using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<IEnumerable<Event>> GetAllAsync(string organizationId)
        {
            return await _eventRepository.GetAllByPartitionKey(organizationId);
        }

        public async Task<Event> GetAsync(string organizationId, string id)
        {
            return await _eventRepository.GetAsync(organizationId, id);
        }

        public async Task CreateAsync(Event _event)
        {
            await _eventRepository.CreateAsync(_event);
        }

        public async Task UpdateAsync(Event _event)
        {
            await _eventRepository.UpdateAsync(_event);
        }

        public async Task DeleteAsync(string organizationId, string id)
        {
            await _eventRepository.DeleteAsync(organizationId, id);
        }
    }
}