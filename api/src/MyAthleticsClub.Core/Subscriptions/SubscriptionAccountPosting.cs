using System;

namespace MyAthleticsClub.Core.Subscriptions
{
    public class SubscriptionAccountPosting : IEntityObject
    {
        public string SubscriptionId { get; }

        public string Id { get; }

        public DateTimeOffset InvoiceDate { get; }

        public decimal Amount { get; }

        public SubscriptionAccountPosting(SubscriptionAccountPostingEntity entity)
        {
            SubscriptionId = entity.PartitionKey;
            Id = entity.RowKey;
            InvoiceDate = entity.InvoiceDate;
            Amount = decimal.Parse(entity.Amount);
        }

        public SubscriptionAccountPosting(string subscriptionId, decimal amount)
        {
            SubscriptionId = subscriptionId;
            Id = Guid.NewGuid().ToString();
            InvoiceDate = DateTimeOffset.Now;
            Amount = amount;
        }

        public string GetPartitionKey()
        {
            return SubscriptionId;
        }

        public string GetRowKey()
        {
            return Id;
        }
    }
}
