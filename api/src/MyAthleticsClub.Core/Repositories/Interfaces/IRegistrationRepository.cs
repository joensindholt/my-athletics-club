using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface IRegistrationRepository
    {
        Task<IEnumerable<Registration>> GetRegistrationsByEventIdAsync(string eventId);

        Task CreateAsync(Registration registration);

        Task DeleteRegistrationAsync(string eventId, string id);
    }
}
