using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface IResultRepository
    {
        Task UpdateResultAsync(string organizationId, Result result, CancellationToken cancellationToken);

        Task<Result> GetResultsAsync(string organizationId, CancellationToken cancellationToken);
    }
}
