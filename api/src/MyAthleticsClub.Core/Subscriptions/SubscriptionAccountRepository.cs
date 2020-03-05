using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Core.Options;

namespace MyAthleticsClub.Core.Subscriptions
{
    public class SubscriptionAccountRepository : AzureStorageRepository<SubscriptionAccountPosting, SubscriptionAccountPostingEntity>, ISubscriptionAccountRepository
    {
        public SubscriptionAccountRepository(CloudStorageAccount account, IOptions<StorageOptions> storageOptions)
            : base(account, "subscriptionpostings", storageOptions)
        {
        }

        public async Task AddPostingAsync(string subscriptionId, decimal amount)
        {
            await CreateInternalAsync(new SubscriptionAccountPosting(subscriptionId, amount));
        }

        public async Task<IEnumerable<SubscriptionAccountPosting>> GetAllPostingsAsync()
        {
            return await GetAllInternalAsync();
        }

        protected override SubscriptionAccountPosting ConvertEntityToObject(SubscriptionAccountPostingEntity entity)
        {
            return new SubscriptionAccountPosting(entity);
        }

        protected override SubscriptionAccountPostingEntity ConvertObjectToEntity(SubscriptionAccountPosting _object)
        {
            return new SubscriptionAccountPostingEntity(
                _object.SubscriptionId,
                _object.Id,
                _object.InvoiceDate,
                _object.Amount.ToString());
        }
    }
}
