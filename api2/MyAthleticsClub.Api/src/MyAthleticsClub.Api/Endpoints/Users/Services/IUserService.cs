using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Users
{
    public interface IUserService
    {
        Task<string> LoginAsync(string username, string password);

        string ValidateToken(string token);
    }
}