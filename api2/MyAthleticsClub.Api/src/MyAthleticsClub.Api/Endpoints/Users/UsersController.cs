using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Users
{
    public class UsersController : Controller
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [Route("api/login")]
        [AllowAnonymous]
        public async Task<UserLoginResponse> Login([FromBody]UserLoginRequest request)
        {
            string token = await _userService.LoginAsync(request.Username, request.Password);
            var response = new UserLoginResponse(token);
            return response;
        }
    }
}