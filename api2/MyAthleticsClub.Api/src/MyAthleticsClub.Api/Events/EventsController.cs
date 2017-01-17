using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Api.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Events
{
    [Route("[controller]")]
    public class EventsController : Controller
    {
        private readonly IEventService _eventService;
        private readonly IIdGenerator _idGenerator;

        public EventsController(IEventService eventService, IIdGenerator idGenerator)
        {
            _eventService = eventService;
            _idGenerator = idGenerator;
        }

        // GET events
        //[Authorize]
        [HttpGet]
        public async Task<IEnumerable<Event>> Get()
        {
            return await _eventService.GetAllAsync();
        }

        // GET events/f43d42...
        //[Authorize]
        [HttpGet("{id}")]
        public async Task<Event> Get(string id)
        {
            return await _eventService.GetAsync("gik", id);
        }

        // POST events
        //[Authorize]
        [HttpPost]
        public async Task<Event> Post([FromBody]Event value)
        {
            value.Id = _idGenerator.GenerateId();
            value.OrganizationId = "gik";

            await _eventService.CreateAsync(value);

            return value;
        }

        // PUT events/f43d42...
        //[Authorize]
        [HttpPut("{id}")] 
        public async Task Put(string id, [FromBody]Event value)
        {
            await _eventService.UpdateAsync(value);
        }

        // DELETE events/f43d42...
        //[Authorize]
        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
            await _eventService.DeleteAsync("gik", id);
        }
    }
}