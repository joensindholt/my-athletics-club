using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface ISubscriptionAccountRepository
    {
        Task AddPostingAsync(string subscriptionId, decimal amount);

        Task<IEnumerable<SubscriptionAccountPosting>> GetAllPostingsAsync();
    }
}
