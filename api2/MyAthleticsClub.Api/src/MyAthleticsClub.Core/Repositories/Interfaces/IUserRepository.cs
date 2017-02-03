using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> FindByCredentialsAsync(string username, string password);
    }
}