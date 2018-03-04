using System.Threading;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json;

namespace MyAthleticsClub.Core.MarsEvents
{
    public class ResultRepository : AzureStorageRepository<Result, ResultEntity>, IResultRepository
    {
        public ResultRepository(CloudStorageAccount account)
            : base(account, "results")
        {
        }

        public async Task<Result> GetResultsAsync(string organizationId, CancellationToken cancellationToken)
        {
            if (!(await base.ExistsInternalAsync(organizationId, "1")))
            {
                return null;
            }

            return await base.GetInternalAsync(organizationId, "1");
        }

        public async Task UpdateResultAsync(string organizationId, Result result, CancellationToken cancellationToken)
        {
            if (await base.ExistsInternalAsync(result.GetPartitionKey(), result.GetRowKey()))
            {
                await base.DeleteAsync(result.GetPartitionKey(), result.GetRowKey());
            }

            await base.CreateInternalAsync(result);
        }

        protected override Result ConvertEntityToObject(ResultEntity entity)
        {
            return JsonConvert.DeserializeObject<Result>(entity.Json);
        }

        protected override ResultEntity ConvertObjectToEntity(Result result)
        {
            return new ResultEntity(JsonConvert.SerializeObject(result));
        }
    }
}
