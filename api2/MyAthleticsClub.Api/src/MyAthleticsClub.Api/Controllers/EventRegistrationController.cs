using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Api.Events
{
    public class EventRegistrationController : Controller
    {
        private readonly IRegistrationService _registrationService;

        public EventRegistrationController(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        [HttpPost("api/events/{eventId}/registrations")]
        [AllowAnonymous]
        public async Task<Registration> Register(string eventId, [FromBody]Registration registration, CancellationToken cancellationToken)
        {
            registration = await _registrationService.AddRegistrationAsync(eventId, registration, cancellationToken);
            return registration;
        }

        [HttpGet("api/events/{eventId}/registrations")]
        [AllowAnonymous]
        public async Task<IEnumerable<Registration>> GetEventRegistrations(string eventId)
        {
            return await _registrationService.GetEventRegistrationsAsync(eventId);
        }

        [HttpGet("api/events/{eventId}/registrations.xlsx")]
        [AllowAnonymous]
        public async Task<FileResult> GetEventRegistrationsAsExcel(string eventId)
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