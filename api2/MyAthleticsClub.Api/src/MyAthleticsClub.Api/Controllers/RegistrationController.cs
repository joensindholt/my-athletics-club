using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Api.Events
{
    public class RegistrationController : Controller
    {
        private readonly IRegistrationService _registrationService;

        public RegistrationController(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        [HttpPost("api/events/{eventId}/registrations")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(Registration), 200)]
        public async Task<IActionResult> Register(string eventId, [FromBody]Registration registration, CancellationToken cancellationToken)
        {
            registration = await _registrationService.AddRegistrationAsync(eventId, registration, cancellationToken);
            return Ok(registration);
        }

        [HttpGet("api/events/{eventId}/registrations")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<Registration>), 200)]
        public async Task<IActionResult> GetEventRegistrations(string eventId)
        {
            var registrations = await _registrationService.GetEventRegistrationsAsync(eventId);
            return Ok(registrations);
        }

        [HttpGet("api/events/{eventId}/registrations.xlsx")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(FileContentResult), 200)]
        public async Task<IActionResult> GetEventRegistrationsAsExcel(string eventId)
        {
            byte[] xlsx = await _registrationService.GetEventRegistrationsAsXlsxAsync(eventId);

            string mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            HttpContext.Response.ContentType = mimeType;
            FileContentResult result = new FileContentResult(xlsx, mimeType)
            {
                FileDownloadName = "deltagere.xlsx"
            };

            return result;
        }
    }
}
