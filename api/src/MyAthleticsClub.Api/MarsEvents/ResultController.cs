using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.MarsEvents;

namespace MyAthleticsClub.Api.MarsEvents
{
    public class ResultController : Controller
    {
        private readonly IResultService _resultService;

        public ResultController(IResultService resultService)
        {
            _resultService = resultService;
        }

        [HttpGet("api/results")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<Result>), 200)]
        [ProducesResponseType(204)]
        public async Task<IActionResult> GetAllResults(CancellationToken cancellationToken)
        {
            Result results = await _resultService.GetResultsAsync("gik", cancellationToken);

            if (results == null)
            {
                return NoContent();
            }

            return Ok(results);
        }

        [HttpGet("api/results/{offset}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<MarsResultInfo>), 200)]
        [ProducesResponseType(204)]
        public async Task<IActionResult> GetOffsetResults([FromRoute]int offset, CancellationToken cancellation)
        {
            var results = await _resultService.GetOffsetResultsAsync(offset, cancellation);

            if (results == null)
            {
                return NoContent();
            }

            return Ok(results);
        }
    }
}
