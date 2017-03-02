﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Utilities;

namespace MyAthleticsClub.Core.Repositories
{
    public abstract class AzureStorageRepository<TObject, TEntity>
        where TObject : IEntityObject
        where TEntity : ITableEntity, new()
    {
        private static List<string> _checkedTables = new List<string>();

        protected CloudStorageAccount _storageAccount;
        protected CloudTable _table;
        protected CloudTableClient _tableClient;

        public AzureStorageRepository(CloudStorageAccount account, string tableName)
        {
            _storageAccount = account;
            _tableClient = _storageAccount.CreateCloudTableClient();
            _table = _tableClient.GetTableReference(tableName);

            if (!_checkedTables.Contains(tableName))
            {
                EnsureTableExists().Wait();
                _checkedTables.Add(tableName);
            }
        }

        public async Task EnsureTableExists()
        {
            bool exists = _table.ExistsAsync().Result;
            if (!exists)
            {
                await _table.CreateAsync();
            }
        }

        public virtual async Task<IEnumerable<TObject>> GetAllAsync()
        {
            var query = new TableQuery<TEntity>();

            var entities = new List<TEntity>();

            TableContinuationToken token = null;
            do
            {
                var segment = await _table.ExecuteQuerySegmentedAsync(query, token);
                entities.AddRange(segment.Results);
                token = segment.ContinuationToken;
            }
            while (token != null);

            var objects = ConvertEntitiesToObjects(entities);

            return objects;
        }

        public virtual async Task<IEnumerable<TObject>> GetAllByPartitionKey(string partitionKey)
        {
            var query = new TableQuery<TEntity>().Where(
                TableQuery.GenerateFilterCondition(
                    "PartitionKey",
                    QueryComparisons.Equal,
                    partitionKey
                )
            );

            var entities = new List<TEntity>();

            TableContinuationToken token = null;
            do
            {
                var segment = await _table.ExecuteQuerySegmentedAsync(query, token);
                entities.AddRange(segment.Results);
                token = segment.ContinuationToken;
            }
            while (token != null);

            var objects = ConvertEntitiesToObjects(entities);

            return objects;
        }

        public virtual async Task CreateAsync(TObject _object)
        {
            _object.GetRowKey().VerifyNotNullOrWhiteSpace("RowKey");
            _object.GetPartitionKey().VerifyNotNullOrWhiteSpace("PartitionKey");

            var entity = ConvertObjectToEntity(_object);
            var operation = TableOperation.Insert(entity);
            await _table.ExecuteAsync(operation);
        }

        public virtual async Task DeleteAsync(string partitionKey, string rowKey)
        {
            partitionKey.VerifyNotNullOrWhiteSpace("partitionKey");
            rowKey.VerifyNotNullOrWhiteSpace("rowKey");

            var getOperation = TableOperation.Retrieve<TEntity>(partitionKey, rowKey);
            var getResult = await _table.ExecuteAsync(getOperation);

            if (getResult.Result == null)
            {
                throw new Exception("No entity found");
            }

            var entity = (TEntity)getResult.Result;
            var operation = TableOperation.Delete(entity);
            await _table.ExecuteAsync(operation);
        }

        public virtual async Task<TObject> GetAsync(string partitionKey, string rowKey)
        {
            partitionKey.VerifyNotNullOrWhiteSpace("partitionKey");
            rowKey.VerifyNotNullOrWhiteSpace("rowKey");

            var operation = TableOperation.Retrieve<TEntity>(partitionKey, rowKey);
            var result = await _table.ExecuteAsync(operation);

            if (result.Result == null)
            {
                throw new Exception("No entity found");
            }

            var _event = ConvertEntityToObject((TEntity)result.Result);

            return _event;
        }

        public virtual async Task<TObject> TryGetAsync(string partitionKey, string rowKey)
        {
            partitionKey.VerifyNotNullOrWhiteSpace("partitionKey");
            rowKey.VerifyNotNullOrWhiteSpace("rowKey");

            var operation = TableOperation.Retrieve<TEntity>(partitionKey, rowKey);
            var result = await _table.ExecuteAsync(operation);

            if (result.Result == null)
            {
                return default(TObject);
            }

            var _event = ConvertEntityToObject((TEntity)result.Result);

            return _event;
        }

        public virtual async Task UpdateAsync(TObject _object)
        {
            _object.GetRowKey().VerifyNotNullOrWhiteSpace("RowKey");
            _object.GetPartitionKey().VerifyNotNullOrWhiteSpace("PartitionKey");

            var entity = ConvertObjectToEntity(_object);
            var operation = TableOperation.Replace(entity);
            await _table.ExecuteAsync(operation);
        }

        protected abstract TObject ConvertEntityToObject(TEntity entity);

        protected abstract TEntity ConvertObjectToEntity(TObject _object);

        protected List<TObject> ConvertEntitiesToObjects(List<TEntity> entities)
        {
            var events = entities
                .Select(entity => ConvertEntityToObject(entity))
                .ToList();

            return events;
        }
    }
}