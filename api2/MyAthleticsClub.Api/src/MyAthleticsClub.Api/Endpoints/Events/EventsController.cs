using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Api.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Events
{
    [Route("api/[controller]")]
    public class EventsController : Controller
    {
        private readonly IEventService _eventService;
        private readonly IIdGenerator _idGenerator;

        public EventsController(IEventService eventService, IIdGenerator idGenerator)
        {
            _eventService = eventService;
            _idGenerator = idGenerator;
        }

        // GET api/events
        [HttpGet]
        [AllowAnonymous]
        public async Task<IEnumerable<Event>> Get()
        {
            return await _eventService.GetAllAsync();
        }

        // GET api/events/f43d42...
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<Event> Get(string id)
        {
            return await _eventService.GetAsync("gik", id);
        }

        // POST api/events
        [HttpPost]
        public async Task<Event> Post([FromBody]Event value)
        {
            value.Id = _idGenerator.GenerateId();
            value.OrganizationId = "gik";

            await _eventService.CreateAsync(value);

            return value;
        }

        // PUT api/events/f43d42...
        [HttpPost("{id}")]
        public async Task Put(string id, [FromBody]Event value)
        {
            value.OrganizationId = "gik";
            await _eventService.UpdateAsync(value);
        }

        // DELETE api/events/f43d42...
        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
            await _eventService.DeleteAsync("gik", id);
        }
    }
}