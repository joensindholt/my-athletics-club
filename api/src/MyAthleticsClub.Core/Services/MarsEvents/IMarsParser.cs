using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Services.MarsEvents
{
    public interface IMarsParser
    {
        string Name { get; }

        Task<IEnumerable<MarsEvent>> ParseEventsAsync(string stopAtMeetId, CancellationToken cancellationToken);
    }
}
