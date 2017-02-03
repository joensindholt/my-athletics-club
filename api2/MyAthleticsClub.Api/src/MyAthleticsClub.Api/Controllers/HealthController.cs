using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAthleticsClub.Api.Health
{
    public class HealthController : Controller
    {
        [HttpGet("api/health")]
        [AllowAnonymous]
        public string Get()
        {
            return "health";
        }
    }
}