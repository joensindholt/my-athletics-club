using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.StorageEntities;

namespace MyAthleticsClub.Core.Repositories
{
    public class SubscriptionAccountRepository : AzureStorageRepository<SubscriptionAccountPosting, SubscriptionAccountPostingEntity>, ISubscriptionAccountRepository
    {
        public SubscriptionAccountRepository(CloudStorageAccount account)
            : base(account, "subscriptionpostings")
        {
        }

        public async Task AddPostingAsync(string subscriptionId, decimal amount)
        {
            await base.CreateAsync(new SubscriptionAccountPosting(subscriptionId, amount));
        }

        public async Task<IEnumerable<SubscriptionAccountPosting>> GetAllPostingsAsync()
        {
            return await base.GetAllAsync();
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
