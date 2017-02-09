using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAthleticsClub.Api.Health
{
    public class HealthController : Controller
    {
        [HttpGet("api/health")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(string), 200)]
        public IActionResult Get()
        {
            return Ok("health");
        }
    }
}
