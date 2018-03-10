using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Events
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllByPartitionKey(string organizationId);

        Task<Event> GetAsync(string organizationId, string id);

        Task CreateAsync(Event _event);

        Task UpdateAsync(Event _event);

        Task SoftDeleteAsync(string organizationId, string id);
    }
}
