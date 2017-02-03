using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Services
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

        public async Task<ClaimsIdentity> TryGetClaimsIdentityAsync(User user)
        {
            var matchingUser = await _userRepository.FindByCredentialsAsync(user.Username, user.Password);

            if (matchingUser != null)
            {
                return new ClaimsIdentity(
                    new GenericIdentity(user.Username, "Token"),
                    new[]
                    {
                            new Claim("Role", "Admin")
                    });
            }

            return null;
        }
    }
}
