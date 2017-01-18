using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyAthleticsClub.Api.Utilities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfigurationRoot _configuration;

        public UserService(IUserRepository userRepository, IConfigurationRoot configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            username.VerifyNotNullOrWhiteSpace();
            password.VerifyNotNullOrWhiteSpace();

            if (!await IsKnownUserAsync(username, password))
            {
                throw new Exception("Unknown combination of username and password");
            }

            var token = GenerateToken(username);

            return token;
        }

        public string ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                RequireExpirationTime = true,
                ValidateLifetime = true,
                IssuerSigningKey = GetTokenSecurityKey(),
                ValidateAudience = false,
                ValidateIssuer = false
            };

            SecurityToken validatedToken;
            var claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out validatedToken);

            return claimsPrincipal.Identity.Name;
        }

        private async Task<bool> IsKnownUserAsync(string username, string password)
        {
            var user = await _userRepository.FindByCredentialsAsync(username, password);
            return user != null;
        }

        private string GenerateToken(string username)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, "admin")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                SigningCredentials = new SigningCredentials(GetTokenSecurityKey(), SecurityAlgorithms.HmacSha256)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.CreateEncodedJwt(tokenDescriptor);
        }

        private SecurityKey GetTokenSecurityKey()
        {
            string jwtTokenKey = _configuration.GetValue<string>("MAC_JWT_TOKEN_KEY");
            var securityKey = new byte[jwtTokenKey.Length * sizeof(char)];
            Buffer.BlockCopy(jwtTokenKey.ToCharArray(), 0, securityKey, 0, securityKey.Length);

            return new SymmetricSecurityKey(securityKey);
        }
    }
}