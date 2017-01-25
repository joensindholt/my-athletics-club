using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Api.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.SysEvents
{
    [Route("api/[controller]")]
    public class SysEventsController : Controller
    {
        private readonly ISysEventService _sysEventService;
        private readonly IIdGenerator _idGenerator;

        public SysEventsController(ISysEventService sysEventService, IIdGenerator idGenerator)
        {
            _sysEventService = sysEventService;
            _idGenerator = idGenerator;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task Post([FromBody]SysEvent _event)
        {
            _event.Id = _idGenerator.GenerateId();
            _event.OrganizationId = "gik";
            await _sysEventService.CreateAsync(_event);
        }

        [HttpGet]
        public async Task<IEnumerable<SysEvent>> GetAll()
        {
            return await _sysEventService.GetAllAsync();
        }
    }
}