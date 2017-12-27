using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly ISubscriptionAccountRepository _subscriptionAccountRepository;
        private readonly IEmailService _emailService;

        public SubscriptionService(
            ISubscriptionRepository subscriptionRepository,
            IMemberRepository memberRepository,
            ISubscriptionAccountRepository subscriptionAccountRepository,
            IEmailService emailService
        )
        {
            _subscriptionRepository = subscriptionRepository;
            _memberRepository = memberRepository;
            _subscriptionAccountRepository = subscriptionAccountRepository;
            _emailService = emailService;
        }

        public async Task<IEnumerable<Subscription>> GetSubscriptionsAsync()
        {
            var members = await _memberRepository.GetActiveMembersAsync("gik");

            // we handle family memberships by grouping subscriptions and taking the first one
            var subscriptions =
                members
                    .Select(m => SubscriptionFactory.CreateSubscription(m))
                    .GroupBy(s => s.Id)
                    .Select(g => g.First())
                    .ToList();

            // get the postings on the all subscriptions accounts and apply them to each subscription
            var postings = await _subscriptionAccountRepository.GetAllPostingsAsync();
            subscriptions.ForEach(s => s.Postings = postings.Where(p => p.SubscriptionId == s.Id).ToList());

            // populate subscription data from storage
            var subscriptionsMetaData = await _subscriptionRepository.GetSubscriptionsMetaDataAsync("gik");
            foreach (var subscriptionMetaData in subscriptionsMetaData.ToList())
            {
                var subscription = subscriptions.SingleOrDefault(s => s.Id == subscriptionMetaData.SubscriptionId);
                if (subscription != null)
                {
                    subscription.LastReminder = subscriptionMetaData.LastReminder;
                    subscription.LastReminderDate = subscriptionMetaData.LastReminderDate;
                }
            }

            return subscriptions;
        }

        public async Task ChargeAllSubscriptionsAsync()
        {
            var subscriptions = await GetSubscriptionsAsync();

            foreach (var subscription in subscriptions)
            {
                await ChargeSubscriptionAsync(subscription);
            }
        }

        public async Task ChargeSubscriptionAsync(Subscription subscription)
        {
            await _subscriptionAccountRepository.AddPostingAsync(subscription.Id, -1 * subscription.Price());
        }

        public async Task SendRemindersAsync(CancellationToken cancellationToken)
        {
            var subscriptions = await GetSubscriptionsAsync();
            var subscriptionsToRemind = subscriptions.Where(s => s.GetReminder().HasValue);

            foreach (var subscription in subscriptionsToRemind)
            {
                var reminder = subscription.GetReminder();
                string reminderTemplate;
                switch (reminder)
                {
                    case 1:
                        reminderTemplate = _emailService.Templates.SubscriptionReminderOne;
                        break;
                    case 2:
                        reminderTemplate = _emailService.Templates.SubscriptionReminderTwo;
                        break;
                    case 3:
                        reminderTemplate = _emailService.Templates.SubscriptionReminderThree;
                        break;
                    default:
                        throw new Exception($"Unknown email template for reminder {reminder}");
                }

                await _emailService.SendTemplateEmailAsync(subscription.Email, reminderTemplate, subscription, cancellationToken);

                subscription.RegisterReminder(reminder);
                await _subscriptionRepository.UpdateSubscriptionMetaDataAsync(subscription);

                cancellationToken.ThrowIfCancellationRequested();
            }
        }
    }
}
