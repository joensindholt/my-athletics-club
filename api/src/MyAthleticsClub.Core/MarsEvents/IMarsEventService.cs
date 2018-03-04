using System.Threading.Tasks;
using Hangfire;

namespace MyAthleticsClub.Core.MarsEvents
{
    public interface IMarsEventService
    {
        Task UpdateEventsAsync(IJobCancellationToken jobCancellationToken);
    }
}
