using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Subscriptions
{
    public interface ISubscriptionService
    {
        Task<IEnumerable<Subscription>> GetSubscriptionsAsync();

        Task ChargeAllSubscriptionsAsync();

        Task ChargeSubscriptionAsync(Subscription subscription);

        Task SendRemindersAsync(CancellationToken cancellationToken);
    }
}
