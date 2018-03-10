using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.MarsEvents
{
    public interface IMarsParser
    {
        string Name { get; }

        Task<IEnumerable<MarsEvent>> ParseEventsAsync(string stopAtMeetId, CancellationToken cancellationToken);
    }
}
