using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.StorageEntities;

namespace MyAthleticsClub.Core.Repositories
{
    public class SubscriptionRepository : AzureStorageRepository<SubscriptionMetaData, SubscriptionMetaDataEntity>, ISubscriptionRepository
    {
        public SubscriptionRepository(CloudStorageAccount account)
            : base(account, "subscriptions")
        {
        }

        public async Task<IEnumerable<SubscriptionMetaData>> GetSubscriptionsMetaDataAsync(string organizationId)
        {
            return await base.GetAllByPartitionKey(organizationId);
        }

        public async Task UpdateSubscriptionMetaDataAsync(Subscription subscription)
        {
            var subscriptionMetaData = SubscriptionMetaData.FromSubscription(subscription);

            if (await base.ExistsAsync(subscriptionMetaData.GetPartitionKey(), subscriptionMetaData.GetRowKey()))
            {
                await base.UpdateAsync(subscriptionMetaData);
            }
            else
            {
                await base.CreateAsync(subscriptionMetaData);
            }
        }

        protected override SubscriptionMetaData ConvertEntityToObject(SubscriptionMetaDataEntity entity)
        {
            return new SubscriptionMetaData
            {
                OrganizationId = entity.OrganizationId,
                SubscriptionId = entity.SubscriptionId,
                LastReminder = entity.LastReminder,
                LastReminderDate = entity.LastReminderDate
            };
        }

        protected override SubscriptionMetaDataEntity ConvertObjectToEntity(SubscriptionMetaData _object)
        {
            return new SubscriptionMetaDataEntity
            {
                PartitionKey = _object.OrganizationId,
                RowKey = _object.SubscriptionId,
                LastReminder = _object.LastReminder,
                LastReminderDate = _object.LastReminderDate
            };
        }
    }
}
