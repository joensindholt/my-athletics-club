using System;
using MyAthleticsClub.Core.Repositories.Interfaces;

namespace MyAthleticsClub.Core.Models
{
    public class SubscriptionMetaData : IEntityObject
    {
        public string OrganizationId { get; set; }

        public string SubscriptionId { get; set; }

        public int? LastReminder { get; set; }

        public DateTime? LastReminderDate { get; set; }

        public string GetPartitionKey()
        {
            return OrganizationId;
        }

        public string GetRowKey()
        {
            return SubscriptionId;
        }

        public static SubscriptionMetaData FromSubscription(Subscription subscription)
        {
            return new SubscriptionMetaData
            {
                OrganizationId = "gik",
                SubscriptionId = subscription.Id,
                LastReminder = subscription.LastReminder,
                LastReminderDate = subscription.LastReminderDate
            };
        }
    }
}
