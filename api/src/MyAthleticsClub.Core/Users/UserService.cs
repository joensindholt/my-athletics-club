using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
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
