using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface ISubscriptionRepository
    {
        Task<IEnumerable<SubscriptionMetaData>> GetSubscriptionsMetaDataAsync(string organizationId);

        Task UpdateSubscriptionMetaDataAsync(Subscription subscription);
    }
}
