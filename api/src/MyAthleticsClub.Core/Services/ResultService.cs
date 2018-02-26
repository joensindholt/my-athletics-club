using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Services
{
    public class ResultService : IResultService
    {
        private const string ResultsCacheKey = "results";

        private readonly IResultRepository _resultRepository;
        private readonly IMarsEventRepository _marsEventRepository;
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<ResultService> _logger;

        public ResultService(
            IResultRepository resultRepository,
            IMarsEventRepository marsEventRepository,
            IMemoryCache memoryCache,
            ILogger<ResultService> logger)
        {
            _resultRepository = resultRepository;
            _marsEventRepository = marsEventRepository;
            _memoryCache = memoryCache;
            _logger = logger;
        }

        public async Task<Result> GetResultsAsync(string organizationId, CancellationToken cancellationToken)
        {
            if (!_memoryCache.TryGetValue(ResultsCacheKey, out Result result))
            {
                _logger.LogInformation("Results not found in cache. Retrieving from data store");
                result = await _resultRepository.GetResultsAsync(organizationId, cancellationToken);
                _memoryCache.Set(ResultsCacheKey, result);
            }

            return result;
        }

        public async Task<MarsResultInfo> GetOffsetResultsAsync(int offset, CancellationToken cancellation)
        {
            var @event =
                (await _marsEventRepository.GetAllEventsAsync("gik", cancellation))
                    .Where(e => e.Results != null && e.Results.Any())
                    .OrderByDescending(e => e.GetDate())
                    .Skip(offset)
                    .FirstOrDefault();

            if (@event == null)
            {
                return null;
            }

            var resultInfo = MarsResultInfo.FromMarsEvent(@event);

            return resultInfo;
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

            _memoryCache.Set(ResultsCacheKey, result);
        }
    }
}
