/*
 * Much of the JWT token stuff comes from here: https://goblincoding.com/2016/07/03/issuing-and-authenticating-jwt-tokens-in-asp-net-core-webapi-part-i/
 */

using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Api.Core.Authentication;
using MyAthleticsClub.Core.Users;
using MyAthleticsClub.Core.Utilities;
using Newtonsoft.Json;

namespace MyAthleticsClub.Api.Users
{
    public class UserController : Controller
    {
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly ILogger _logger;
        private readonly IUserService _userService;
        private readonly HttpClient _httpClient;

        public UserController(
            IOptions<JwtIssuerOptions> jwtOptions,
            ILogger<UserController> logger,
            IUserService userService,
            HttpClient httpClient)
        {
            _logger = logger;

            _jwtOptions = jwtOptions.Value;
            JwtIssuerOptionsValidator.EnsureValidOptions(_jwtOptions);

            _userService = userService;
            _httpClient = httpClient;
        }

        [HttpPost]
        [Route("/api/login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        public async Task<IActionResult> Login([FromBody] User applicationUser)
        {
            var identity = await _userService.TryGetClaimsIdentityAsync(applicationUser);
            if (identity == null)
            {
                _logger.LogInformation($"Invalid username ({applicationUser.Username}) or password ({applicationUser.Password})");
                return BadRequest("Invalid credentials");
            }

            (string encodedJwt, DateTime expiration) = await GetJwtTokenAsync(applicationUser.Username, "Admin");

            // Serialize and return the response
            var response = new LoginResponse(applicationUser.Username, encodedJwt, expiration.ToUnixEpochDate());

            return Ok(response);
        }

        [HttpPost]
        [Route("/api/login-google")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        public async Task<IActionResult> LoginGoogle([FromBody] GoogleLoginRequest login)
        {
            var response = await _httpClient.GetAsync("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + login.IdToken);

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest(response.ReasonPhrase);
            }

            var content = await response.Content.ReadAsStringAsync();
            var claims = JsonConvert.DeserializeObject<GoogleTokenClaims>(content);

            var user = await _userService.FindByEmailAsync(claims.Email);

            if (user == null)
            {
                return Unauthorized();
            }

            (string encodedJwt, DateTime expiration) = await GetJwtTokenAsync(user.Username, "Admin");

            // Serialize and return the response
            var result = new LoginResponse(user.Username, encodedJwt, expiration.ToUnixEpochDate());

            return Ok(result);
        }

        private async Task<(string encodedJwt, DateTime expiration)> GetJwtTokenAsync(string username, string role)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                new Claim(JwtRegisteredClaimNames.Iat, _jwtOptions.IssuedAt.ToUnixEpochDate().ToString(), ClaimValueTypes.Integer64),
                new Claim("Role", role)
            };

            // Create the JWT security token and encode it.
            var expiration = DateTime.UtcNow.AddDays(7);
            var notBefore = DateTime.UtcNow.AddMinutes(-5);

            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: notBefore,
                expires: expiration,
                signingCredentials: _jwtOptions.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return (encodedJwt, expiration);
        }

        // This route needs auth by default so if it returns ok
        // the user is logged in
        [HttpGet]
        [Route("/api/isloggedin")]
        [ProducesResponseType(200)]
        public IActionResult IsLoggedIn()
        {
            return Ok();
        }
    }
}
