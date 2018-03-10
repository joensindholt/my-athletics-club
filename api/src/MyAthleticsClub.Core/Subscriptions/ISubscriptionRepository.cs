using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Subscriptions
{
    public interface ISubscriptionRepository
    {
        Task<IEnumerable<SubscriptionMetaData>> GetSubscriptionsMetaDataAsync(string organizationId);

        Task UpdateSubscriptionMetaDataAsync(Subscription subscription);
    }
}
