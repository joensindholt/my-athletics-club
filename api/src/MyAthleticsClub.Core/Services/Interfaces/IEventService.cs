using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllAsync(string organizationId);

        Task<Event> GetAsync(string organizationId, string id);

        Task CreateAsync(Event _event);

        Task UpdateAsync(Event _event);

        Task DeleteAsync(string organizationId, string id);
    }
}