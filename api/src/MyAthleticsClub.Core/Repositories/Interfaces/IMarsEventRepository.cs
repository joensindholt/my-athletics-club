using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface IMarsEventRepository
    {
        Task<MarsEvent> GetLastRetrievedEventAsync(string organizationId, string parserName, CancellationToken cancellationToken);

        Task AddEventsAsync(IEnumerable<MarsEvent> events, CancellationToken cancellationToken);

        Task<IEnumerable<MarsEvent>> GetAllEventsAsync(string organizationId, CancellationToken cancellationToken);
    }
}
