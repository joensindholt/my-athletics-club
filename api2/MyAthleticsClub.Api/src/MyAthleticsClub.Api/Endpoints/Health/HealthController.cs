using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAthleticsClub.Api.Health
{
    [Route("api/[controller]")]
    public class HealthController : Controller
    {
        // GET api/health
        [HttpGet]
        [AllowAnonymous]
        public string Get()
        {
            return "health";
        }
    }
}