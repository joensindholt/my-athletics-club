using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Services
{
    public class ResultService : IResultService
    {
        private readonly IResultRepository _resultRepository;
        private readonly IMarsEventRepository _marsEventRepository;

        public ResultService(
            IResultRepository resultRepository,
            IMarsEventRepository marsEventRepository)
        {
            _resultRepository = resultRepository;
            _marsEventRepository = marsEventRepository;
        }

        public async Task<Result> GetResultsAsync(string organizationId, CancellationToken cancellationToken)
        {
            return await _resultRepository.GetResultsAsync(organizationId, cancellationToken);
        }

        /// <summary>
        /// Gets the Mars events from storage and stores the resulting result data in storage for client retrieval
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>A task</returns>
        public async Task UpdateResultsAsync(CancellationToken cancellationToken)
        {
            var events = await _marsEventRepository.GetAllEventsAsync("gik", cancellationToken);
            var result = Result.FromMarsEvents(events);
            await _resultRepository.UpdateResultAsync("gik", result, cancellationToken);
        }
    }
}
