using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IResultService
    {
        Task UpdateResultsAsync(CancellationToken cancellationToken);

        Task<Result> GetResultsAsync(string organizationId, CancellationToken cancellationToken);
    }
}
