using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAthleticsClub.Api.SysEvents
{
    [Route("api/[controller]")]
    public class SysEventsController : Controller
    {
        public SysEventsController()
        {
        }

        [HttpPost]
        [AllowAnonymous]
        public void Post()
        {
            // Dummy endpoint for backwards compatibility
        }

        [HttpGet]
        public void GetAll()
        {
            // Dummy endpoint for backwards compatibility
        }
    }
}