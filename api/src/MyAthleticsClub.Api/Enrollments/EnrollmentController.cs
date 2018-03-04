using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Enrollments;

namespace MyAthleticsClub.Api.Enrollments
{
    public class EnrollmentController : Controller
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        [HttpPost("api/enroll")]
        [AllowAnonymous]
        [ProducesResponseType(200)]
        public async Task<IActionResult> Enroll([FromBody]EnrollmentRequest enrollment, CancellationToken cancellationToken)
        {
            await _enrollmentService.EnrollAsync(enrollment, cancellationToken);
            return Ok();
        }
    }
}
