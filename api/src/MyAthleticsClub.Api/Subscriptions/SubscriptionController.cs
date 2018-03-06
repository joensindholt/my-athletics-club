using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Subscriptions;

namespace MyAthleticsClub.Api.Subscriptions
{
    public class SubscriptionController : Controller
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        [HttpGet("api/subscriptions")]
        [ProducesResponseType(typeof(IEnumerable<SubscriptionResponse>), 200)]
        public async Task<IActionResult> GetAllSubscriptions()
        {
            var subscriptions = await _subscriptionService.GetSubscriptionsAsync();
            var response = subscriptions.Select(s => new SubscriptionResponse(s));
            return Ok(response);
        }

        [HttpPost("api/subscriptions/reminders")]
        [ProducesResponseType(typeof(IEnumerable<SubscriptionResponse>), 200)]
        public async Task<IActionResult> SendReminders(CancellationToken cancellationToken)
        {
            await _subscriptionService.SendRemindersAsync(cancellationToken);

            var subscriptions = await _subscriptionService.GetSubscriptionsAsync();
            var response = subscriptions.Select(s => new SubscriptionResponse(s));
            return Ok(response);
        }
    }
}
