using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using MyAthleticsClub.Api.Infrastructure.Persistence;

namespace MyAthleticsClub.Api.Infrastructure.AzureTableStorage
{
    public class AzureTableStorageRepository : IAzureTableStorageRepository
    {
        private readonly CloudStorageAccount _storageAccount;
        private readonly CloudTableClient _tableClient;
        private readonly TableEntityConverter _tableEntityConverter;

        public AzureTableStorageRepository(CloudStorageAccount account)
        {
            _storageAccount = account;
            _tableClient = _storageAccount.CreateCloudTableClient();
            _tableEntityConverter = new TableEntityConverter();
        }

        public async Task<IEnumerable<object>> GetAll(Type entityType)
        {
            var query = new TableQuery();

            var entities = new List<object>();

            TableContinuationToken? token = null;
            do
            {
                var table = _tableClient.GetTableReference(GetTableName(entityType));
                var segment = await table.ExecuteQuerySegmentedAsync(query, token);
                entities.AddRange(_tableEntityConverter.ConvertDynamicEntities(segment.Results, entityType));
                token = segment.ContinuationToken;
            }
            while (token != null);

            return entities;
        }

        public async Task Add(object entity)
        {
            var tableEntity = _tableEntityConverter.ConvertToDynamicEntity(entity);
            var operation = TableOperation.Insert(tableEntity);
            var table = _tableClient.GetTableReference(GetTableName(entity.GetType()));
            await table.ExecuteAsync(operation);
        }

        public Task Update(object entity)
        {
            throw new NotImplementedException();
        }

        public Task Delete(object entity)
        {
            throw new NotImplementedException();
        }

        /// Get table name by doing simple pluralization of entity name
        /// Member => members
        /// Event => events
        private string GetTableName(Type type)
        {
            var typeName = type.Name;
            var simplePluralTypeName = typeName + "s";
            var lowercased = simplePluralTypeName.ToLower();
            return lowercased;
        }
    }
}