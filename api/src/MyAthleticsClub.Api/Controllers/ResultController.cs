using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Api.Controllers
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
        public async Task<IActionResult> GetAllResults(CancellationToken cancellationToken)
        {
            var results = await _resultService.GetResultsAsync("gik", cancellationToken);

            if (results == null)
            {
                return NoContent();
            }

            return Ok(results);
        }
    }
}
