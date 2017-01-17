using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using MyAthleticsClub.Api.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api
{
    public abstract class AzureStorageService<TObject, TEntity>
        where TObject : IEntityObject
        where TEntity : ITableEntity, new()
    {
        protected CloudStorageAccount _storageAccount;
        protected CloudTable _table;
        protected CloudTableClient _tableClient;

        public AzureStorageService(IConfigurationRoot configuration, string tableName)
        {
            _storageAccount = CloudStorageAccount.Parse(configuration.GetConnectionString("AzureTableStorage"));
            _tableClient = _storageAccount.CreateCloudTableClient();
            _table = _tableClient.GetTableReference(tableName);
        }

        public virtual async Task CreateAsync(TObject _object)
        {
            _object.Id.VerifyNotNullOrWhiteSpace();
            _object.GetPartitionKey().VerifyNotNullOrWhiteSpace();

            var entity = ConvertObjectToEntity(_object);
            var operation = TableOperation.Insert(entity);
            await _table.ExecuteAsync(operation);
        }

        public virtual async Task DeleteAsync(string partitionId, string id)
        {
            partitionId.VerifyNotNullOrWhiteSpace();
            id.VerifyNotNullOrWhiteSpace();

            var getOperation = TableOperation.Retrieve<TEntity>(partitionId, id);
            var getResult = await _table.ExecuteAsync(getOperation);

            if (getResult.Result == null)
            {
                throw new Exception("No entity found");
            }

            var entity = (TEntity)getResult.Result;
            var operation = TableOperation.Delete(entity);
            await _table.ExecuteAsync(operation);
        }

        public async Task EnsureTableExists()
        {
            bool exists = _table.ExistsAsync().Result;
            if (!exists)
            {
                await _table.CreateAsync();
            }
        }

        public virtual async Task<TObject> GetAsync(string partitionId, string id)
        {
            partitionId.VerifyNotNullOrWhiteSpace();
            id.VerifyNotNullOrWhiteSpace();

            var operation = TableOperation.Retrieve<TEntity>(partitionId, id);
            var result = await _table.ExecuteAsync(operation);

            if (result.Result == null)
            {
                throw new Exception("No entity found");
            }

            var _event = ConvertEntityToObject((TEntity)result.Result);

            return _event;
        }

        public virtual async Task<IEnumerable<TObject>> GetAllAsync()
        {
            var query = new TableQuery<TEntity>();

            var eventEntities = new List<TEntity>();

            TableContinuationToken token = null;
            do
            {
                var segment = await _table.ExecuteQuerySegmentedAsync<TEntity>(query, token);
                eventEntities.AddRange(segment.Results);
                token = segment.ContinuationToken;
            }
            while (token != null);

            var events = ConvertEntitiesToObjects(eventEntities);

            return events;
        }

        public virtual async Task UpdateAsync(TObject _object)
        {
            _object.Id.VerifyNotNullOrWhiteSpace();
            _object.GetPartitionKey().VerifyNotNullOrWhiteSpace();

            var entity = ConvertObjectToEntity(_object);
            var operation = TableOperation.Replace(entity);
            await _table.ExecuteAsync(operation);
        }

        protected abstract TObject ConvertEntityToObject(TEntity entity);

        protected abstract TEntity ConvertObjectToEntity(TObject _object);

        private List<TObject> ConvertEntitiesToObjects(List<TEntity> entities)
        {
            var events = entities
                .Select(entity => ConvertEntityToObject(entity))
                .ToList();

            return events;
        }
    }
}