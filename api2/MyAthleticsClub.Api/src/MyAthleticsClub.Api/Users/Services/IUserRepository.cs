using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Users
{
    public interface IUserRepository
    {
        Task<User> FindByCredentialsAsync(string username, string password);
    }
}