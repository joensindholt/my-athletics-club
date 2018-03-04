using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Users
{
    public interface IUserRepository
    {
        Task<User> FindByCredentialsAsync(string username, string password);

        Task<User> FindByEmailAsync(string email);
    }
}
