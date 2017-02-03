using System.Security.Claims;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IUserService
    {
        Task<ClaimsIdentity> TryGetClaimsIdentityAsync(User user);
    }
}