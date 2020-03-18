using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Api.Infrastructure.AzureTableStorage
{
    public class TableEntityConverter
    {
        public IEnumerable<object> ConvertDynamicEntities(IList<DynamicTableEntity> results, Type targetType)
        {
            return results.Select(r => ConvertDynamicEntity(r, targetType));
        }

        public object ConvertDynamicEntity(DynamicTableEntity tableEntity, Type targetType)
        {
            var entity = Activator.CreateInstance(targetType, true);

            var entityProperties = targetType.GetProperties().Where(p => p.CanWrite).ToList();

            // Set Id on entity equal to RowKey from the table entity
            var idProperty = entityProperties.First(p => p.Name == "Id");
            idProperty.SetValue(entity, tableEntity.RowKey);

            // If the entity has a ParentId property set it to the PartitionKey value of the tableEntity
            var parentIdProperty = entityProperties.FirstOrDefault(p => p.Name == "ParentId");
            if (parentIdProperty != null)
            {
                parentIdProperty.SetValue(entity, tableEntity.PartitionKey);
            }

            // Loop through the rest of the properties
            entityProperties
                .Where(p => p.Name != "Id" && p.Name != "ParentId")
                .ToList()
                .ForEach(targetProperty =>
                {
                    if (tableEntity.Properties.Any(p => p.Key == targetProperty.Name))
                    {
                        var tableEntityValue = tableEntity.Properties.First(p => p.Key == targetProperty.Name).Value;
                        targetProperty.SetValue(entity, tableEntityValue.PropertyAsObject);
                    }
                });

            return entity;
        }

        public DynamicTableEntity ConvertToDynamicEntity(object entity)
        {
            var tableEntity = new DynamicTableEntity();

            var entityType = entity.GetType();
            var entityProperties = entityType.GetProperties().Where(p => p.CanRead).ToList();

            // Set the PartitionKey to the value of ParentId is it exists. Default to "global"
            var parentIdProperty = entityProperties.FirstOrDefault(p => p.Name == "ParentId");
            if (parentIdProperty != null)
            {
                tableEntity.PartitionKey = parentIdProperty.GetValue(entity).ToString();
            }
            else
            {
                tableEntity.PartitionKey = "global";
            }

            // Set the RowKey equal to the Id from the entity
            tableEntity.RowKey = entityType.GetProperty("Id").GetValue(entity).ToString();

            // Set all other properties
            entityProperties
                .Where(p => p.Name != "Id" && p.Name != "ParentId")
                .ToList()
                .ForEach(targetProperty =>
                {
                    tableEntity.Properties.Add(
                        targetProperty.Name,
                        EntityProperty.CreateEntityPropertyFromObject(targetProperty.GetValue(entity)));
                });

            return tableEntity;
        }
    }
}