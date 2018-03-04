using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Events
{
    public interface IRegistrationRepository
    {
        Task<IEnumerable<Registration>> GetRegistrationsByEventIdAsync(string eventId);

        Task CreateAsync(Registration registration);

        Task DeleteRegistrationAsync(string eventId, string id);
    }
}
