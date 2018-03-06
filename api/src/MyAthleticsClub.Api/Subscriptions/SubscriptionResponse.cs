using System;
using MyAthleticsClub.Core.Subscriptions;

namespace MyAthleticsClub.Api.Subscriptions
{
    public class SubscriptionResponse
    {
        public string Id { get; }

        public string Title { get; }

        public decimal Price { get; }

        public decimal Balance { get; }

        public DateTime? LatestInvoiceDate { get; }

        public int? LastReminder { get; }

        public int? Reminder { get; }

        public SubscriptionResponse(Subscription subscription)
        {
            Id = subscription.Id;
            Title = subscription.Title;
            Price = subscription.Price();
            Balance = subscription.GetBalance();
            LatestInvoiceDate = subscription.GetLatestInvoiceDate()?.UtcDateTime;
            LastReminder = subscription.LastReminder;
            Reminder = subscription.GetReminder();
        }
    }
}
