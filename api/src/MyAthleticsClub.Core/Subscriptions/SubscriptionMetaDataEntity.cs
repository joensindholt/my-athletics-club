using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.Subscriptions
{
    public class SubscriptionMetaDataEntity : TableEntity
    {
        public SubscriptionMetaDataEntity()
        {
        }

        public SubscriptionMetaDataEntity(string organizationId, string subscriptionId)
            : base(organizationId, subscriptionId)
        {
        }

        public string OrganizationId => PartitionKey;

        public string SubscriptionId => RowKey;

        public int? LastReminder { get; set; }

        public DateTime? LastReminderDate { get; set; }
    }
}
