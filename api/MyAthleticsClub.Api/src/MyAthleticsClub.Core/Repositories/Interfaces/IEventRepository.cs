using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllByPartitionKey(string organizationId);

        Task<Event> GetAsync(string organizationId, string id);

        Task CreateAsync(Event _event);

        Task UpdateAsync(Event _event);

        Task DeleteAsync(string organizationId, string id);
    }
}