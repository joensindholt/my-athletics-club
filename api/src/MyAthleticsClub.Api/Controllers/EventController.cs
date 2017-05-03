using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Utilities;

namespace MyAthleticsClub.Api.Controllers
{
    public class EventController : Controller
    {
        private readonly IEventService _eventService;
        private readonly IIdGenerator _idGenerator;

        public EventController(IEventService eventService, IIdGenerator idGenerator)
        {
            _eventService = eventService;
            _idGenerator = idGenerator;
        }

        [HttpGet("api/events")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<Event>), 200)]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllAsync("gik");
            return Ok(events);
        }

        [HttpGet("api/events/{id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(Event), 200)]
        public async Task<IActionResult> GetEvent(string id)
        {
            var _event = await _eventService.GetAsync("gik", id);
            return Ok(_event);
        }

        [HttpPost("api/events")]
        [ProducesResponseType(typeof(Event), 200)]
        public async Task<IActionResult> CreateEvent([FromBody]Event value)
        {
            value.Id = _idGenerator.GenerateId();
            value.OrganizationId = "gik";

            await _eventService.CreateAsync(value);

            return Ok(value);
        }

        [HttpPost("api/events/{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> UpdateEvent(string id, [FromBody]Event value)
        {
            value.OrganizationId = "gik";
            await _eventService.UpdateAsync(value);
            return Ok();
        }

        [HttpDelete("api/events/{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> DeleteEvent(string id)
        {
            await _eventService.DeleteAsync("gik", id);
            return Ok();
        }
    }
}
