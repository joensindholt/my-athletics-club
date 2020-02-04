using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Server.Models
{
    public class DataStore
    {
        private readonly CloudStorageAccount _storageAccount;

        public DataStore()
        {
            _storageAccount = CloudStorageAccount.Parse("...");
        }

        public async Task<IEnumerable<Member>> FindMembers(string filter = null)
        {
            return await FindAll<Member>("members", filter);
        }

        private async Task<IEnumerable<T>> FindAll<T>(string tableName, string filter = null) where T : ITableEntity, new()
        {
            var client = _storageAccount.CreateCloudTableClient();
            var table = client.GetTableReference(tableName);
            
            // Always filter by partition key
            var condition = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "gik");

            //
            if (filter != null)
            {
                condition = TableQuery.CombineFilters(condition, TableOperators.And, filter);
            }

            var query = new TableQuery<T>().Where(condition);
            var results = new List<T>();
            TableQuerySegment<T> segment = null;
            do
            {
                segment = await table.ExecuteQuerySegmentedAsync(query, segment?.ContinuationToken);
                results.AddRange(segment.Results);
            }
            while (segment.ContinuationToken != null);

            return results;
        }
    }
}