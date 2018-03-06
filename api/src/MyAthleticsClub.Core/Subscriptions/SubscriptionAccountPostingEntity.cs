using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.Subscriptions
{
    public class SubscriptionAccountPostingEntity : TableEntity
    {
        public string Amount { get; set; }

        public DateTimeOffset InvoiceDate { get; set; } 

        public SubscriptionAccountPostingEntity()
        {
        }

        public SubscriptionAccountPostingEntity(
            string subscriptionId,
            string id,
            DateTimeOffset invoiceDate,
            string amount
        )
        {
            PartitionKey = subscriptionId;
            RowKey = id;
            InvoiceDate = invoiceDate;
            Amount = amount;
        }
    }
}
