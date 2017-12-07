using System.Threading.Tasks;
using Hangfire;

namespace MyAthleticsClub.Core.Services.MarsEvents
{
    public interface IMarsEventService
    {
        Task UpdateEventsAsync(IJobCancellationToken jobCancellationToken);
    }
}
