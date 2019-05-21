using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.Enrollments;
using Newtonsoft.Json;

namespace MyAthleticsClub.Api.Enrollments
{
    public class EnrollmentController : Controller
    {
        private readonly IEnrollmentService _enrollmentService;
        private readonly ILogger<EnrollmentController> _logger;

        public EnrollmentController(IEnrollmentService enrollmentService, ILogger<EnrollmentController> logger)
        {
            _enrollmentService = enrollmentService;
            _logger = logger;
        }

        [HttpPost("api/enroll")]
        [AllowAnonymous]
        [ProducesResponseType(200)]
        public async Task<IActionResult> Enroll([FromBody]EnrollmentRequest enrollment, CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Got enrollment: {JsonConvert.SerializeObject(enrollment)}");
            await _enrollmentService.EnrollAsync(enrollment, cancellationToken);
            return Ok();
        }
    }
}
