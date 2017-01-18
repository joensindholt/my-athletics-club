using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Users
{
    public class UserRepository : IUserRepository
    {
        public async Task<User> FindByCredentialsAsync(string username, string password)
        {
            var users = await GetAllAsync();
            var user = users.FirstOrDefault(u => u.Username == username && u.Password == password);
            return user;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            var usersFile = "./users.json";
            if (!File.Exists(usersFile))
            {
                throw new Exception("no users information found");
            }

            List<User> users = null;

            using (var stream = File.OpenRead(usersFile))
            {
                using (var reader = new StreamReader(stream))
                {
                    string userJson = await reader.ReadToEndAsync();
                    users = JsonConvert.DeserializeObject<List<User>>(userJson);
                }
            }

            return users;
        }
    }
}