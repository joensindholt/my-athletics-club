using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.MarsEvents
{
    public interface IResultRepository
    {
        Task UpdateResultAsync(string organizationId, Result result, CancellationToken cancellationToken);

        Task<Result> GetResultsAsync(string organizationId, CancellationToken cancellationToken);
    }
}
