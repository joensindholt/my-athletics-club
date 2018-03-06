using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Subscriptions
{
    public interface ISubscriptionAccountRepository
    {
        Task AddPostingAsync(string subscriptionId, decimal amount);

        Task<IEnumerable<SubscriptionAccountPosting>> GetAllPostingsAsync();
    }
}
