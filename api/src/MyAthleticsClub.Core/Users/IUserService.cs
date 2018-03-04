using System.Security.Claims;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Users
{
    public interface IUserService
    {
        Task<ClaimsIdentity> TryGetClaimsIdentityAsync(User user);

        Task<User> FindByEmailAsync(string email);
    }
}
