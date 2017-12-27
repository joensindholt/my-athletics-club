using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface ISubscriptionService
    {
        Task<IEnumerable<Subscription>> GetSubscriptionsAsync();

        Task ChargeAllSubscriptionsAsync();

        Task ChargeSubscriptionAsync(Subscription subscription);

        Task SendRemindersAsync(CancellationToken cancellationToken);
    }
}
