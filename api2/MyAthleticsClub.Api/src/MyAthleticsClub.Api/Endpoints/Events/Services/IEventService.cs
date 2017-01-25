using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Events
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllAsync();

        Task<Event> GetAsync(string organizationId, string id);

        Task CreateAsync(Event _event);

        Task UpdateAsync(Event _event);

        Task DeleteAsync(string organizationId, string id);
    }
}