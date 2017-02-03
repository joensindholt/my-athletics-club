using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Utilities;

namespace MyAthleticsClub.Api.Events
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
        public async Task<IEnumerable<Event>> GetAllEvents()
        {
            return await _eventService.GetAllAsync("gik");
        }

        [HttpGet("api/events/{id}")]
        [AllowAnonymous]
        public async Task<Event> GetEvent(string id)
        {
            return await _eventService.GetAsync("gik", id);
        }

        [HttpPost("api/events")]
        public async Task<Event> CreateEvent([FromBody]Event value)
        {
            value.Id = _idGenerator.GenerateId();
            value.OrganizationId = "gik";

            await _eventService.CreateAsync(value);

            return value;
        }

        [HttpPost("api/events/{id}")]
        public async Task UpdateEvent(string id, [FromBody]Event value)
        {
            value.OrganizationId = "gik";
            await _eventService.UpdateAsync(value);
        }

        [HttpDelete("api/events/{id}")]
        public async Task DeleteEvent(string id)
        {
            await _eventService.DeleteAsync("gik", id);
        }
    }
}
