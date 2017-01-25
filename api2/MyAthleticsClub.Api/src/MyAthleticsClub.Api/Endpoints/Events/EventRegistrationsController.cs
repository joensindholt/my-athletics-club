using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Events
{
    public class EventRegistrationsController : Controller
    {
        private readonly IRegistrationService _registrationService;

        public EventRegistrationsController(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        // GET api/events/f43d42.../registrations
        [HttpGet]
        [Route("api/events/{eventId}/registrations")]
        [AllowAnonymous]
        public async Task<IEnumerable<Registration>> Get(string eventId)
        {
            return await _registrationService.GetEventRegistrationsAsync(eventId);
        }

        // POST api/events/f43d42.../registrations
        [HttpPost]
        [Route("api/events/{eventId}/registrations")]
        [AllowAnonymous]
        public async Task<Registration> Post(string eventId, [FromBody]Registration registration, CancellationToken cancellationToken)
        {
            registration = await _registrationService.AddRegistrationAsync(eventId, registration, cancellationToken);
            return registration;
        }

        // GET api/events/f43d42.../registrations.xlsx
        [HttpGet]
        [Route("api/events/{eventId}/registrations.xlsx")]
        [AllowAnonymous]
        public async Task<FileResult> GetExcel(string eventId)
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