using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.StorageEntities;

namespace MyAthleticsClub.Core.Repositories
{
    public class UserRepository : AzureStorageRepository<User, UserEntity>, IUserRepository
    {
        public UserRepository(CloudStorageAccount account)
            : base(account, "users")
        {
        }

        public async Task<User> FindByCredentialsAsync(string username, string password)
        {
            var users = await GetAllAsync();
            return users.FirstOrDefault(u => u.Username == username && u.Password == password);
        }

        public async Task<User> FindByEmailAsync(string email)
        {
            var users = await GetAllAsync();
            return users.FirstOrDefault(u => u.Username == email);
        }

        protected override User ConvertEntityToObject(UserEntity entity)
        {
            var user = new User(entity.OrganizationId, entity.Username, entity.Password);
            return user;
        }

        protected override UserEntity ConvertObjectToEntity(User user)
        {
            var userEntity = new UserEntity("gik", user.Username, user.Password);
            return userEntity;
        }
    }
}
