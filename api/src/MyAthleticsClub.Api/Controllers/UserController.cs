/*
 * Much of the JWT token stuff comes from here: https://goblincoding.com/2016/07/03/issuing-and-authenticating-jwt-tokens-in-asp-net-core-webapi-part-i/
 */

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Api.Core.Authentication;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Utilities;
using Newtonsoft.Json;

namespace MyAthleticsClub.Api.Controllers
{
    public class UserController : Controller
    {
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly ILogger _logger;
        private readonly IUserService _userService;

        public UserController(IOptions<JwtIssuerOptions> jwtOptions, ILogger<UserController> logger, IUserService userService)
        {
            _logger = logger;

            _jwtOptions = jwtOptions.Value;
            JwtIssuerOptionsValidator.EnsureValidOptions(_jwtOptions);

            _userService = userService;
        }

        [HttpPost]
        [Route("/api/login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] User applicationUser)
        {
            var identity = await _userService.TryGetClaimsIdentityAsync(applicationUser);
            if (identity == null)
            {
                _logger.LogInformation($"Invalid username ({applicationUser.Username}) or password ({applicationUser.Password})");
                return BadRequest("Invalid credentials");
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, applicationUser.Username),
                new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                new Claim(JwtRegisteredClaimNames.Iat, _jwtOptions.IssuedAt.ToUnixEpochDate().ToString(), ClaimValueTypes.Integer64),
                identity.FindFirst("Role")
            };

            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: _jwtOptions.NotBefore,
                expires: _jwtOptions.Expiration,
                signingCredentials: _jwtOptions.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            // Serialize and return the response
            var response = new
            {
                access_token = encodedJwt,
                expires_in = (int)_jwtOptions.ValidFor.TotalSeconds
            };

            var json = JsonConvert.SerializeObject(response, new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            });

            return new OkObjectResult(json);
        }
    }
}
