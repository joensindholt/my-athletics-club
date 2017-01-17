using Microsoft.AspNetCore.Mvc;

namespace MyAthleticsClub.Api.Health
{
    [Route("[controller]")]
    public class HealthController : Controller
    {
        // GET health
        [HttpGet]
        public string Get()
        {
            return "health";
        }
    }
}