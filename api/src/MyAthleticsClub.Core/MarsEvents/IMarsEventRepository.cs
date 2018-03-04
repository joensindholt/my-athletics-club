using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.MarsEvents
{
    public interface IMarsEventRepository
    {
        Task<MarsEvent> GetLastRetrievedEventAsync(string organizationId, string parserName, CancellationToken cancellationToken);

        Task AddEventsAsync(IEnumerable<MarsEvent> events, CancellationToken cancellationToken);

        Task<IEnumerable<MarsEvent>> GetAllEventsAsync(string organizationId, CancellationToken cancellationToken);
    }
}
