using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.MarsEvents
{
    public interface IResultService
    {
        Task UpdateResultsAsync(CancellationToken cancellationToken);

        Task<Result> GetResultsAsync(string organizationId, CancellationToken cancellationToken);

        Task<MarsResultInfo> GetOffsetResultsAsync(int offset, CancellationToken cancellation);
    }
}
