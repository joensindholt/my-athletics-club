using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.Storage.Table;
using MyAthleticsClub.Api.Infrastructure.AzureTableStorage;
using Xunit;

namespace MyAthleticsClub.Api.UnitTests.InfrastructureTests.AzureTableStorageTests
{
    public class TableEntityConverterTests
    {
        private readonly TableEntityConverter _converter;

        public TableEntityConverterTests()
        {
            _converter = new TableEntityConverter();
        }

        [Fact]
        public void ConvertDynamicEntity_CanConvertEntity()
        {
            // Arrange
            string partitionKey = "ThePartitionKey";
            string rowKey = "TheRowKey";
            string stringValue = "A string";
            int intValue = 1;
            int? nullableIntValue = 2;
            bool booleanValue = true;
            bool? nullableBooleanValue = true;
            DateTime dateTimeValue = DateTime.UtcNow;

            var tableEntity = new DynamicTableEntity
            {
                PartitionKey = partitionKey,
                RowKey = rowKey,
                ETag = "*",
                Timestamp = DateTimeOffset.UtcNow,
                Properties = new Dictionary<string, EntityProperty>
                {
                    { "StringValue", new EntityProperty(stringValue) },
                    { "IntValue", new EntityProperty(intValue) },
                    { "NullableIntValue", new EntityProperty(nullableIntValue) },
                    { "BooleanValue", new EntityProperty(booleanValue) },
                    { "NullableBooleanValue", new EntityProperty(nullableBooleanValue) },
                    { "DateTimeValue", new EntityProperty(dateTimeValue) }
                }
            };

            // Act
            var entity = (TestEntity)_converter.ConvertDynamicEntity(tableEntity, typeof(TestEntity));

            // Assert
            Assert.NotNull(entity);
            Assert.Equal(entity.Id, rowKey);
            Assert.Equal(entity.StringValue, stringValue);
            Assert.Equal(entity.IntValue, intValue);
            Assert.Equal(entity.NullableIntValue, nullableIntValue);
            Assert.Equal(entity.BooleanValue, booleanValue);
            Assert.Equal(entity.NullableBooleanValue, nullableBooleanValue);
            Assert.Equal(entity.DateTimeValue, dateTimeValue);
        }

        private class TestEntity
        {
            public TestEntity()
            {
                Id = Guid.NewGuid().ToString();
            }

            public string Id { get; set; }
            public string StringValue { get; set; } = null!;
            public int IntValue { get; set; }
            public int? NullableIntValue { get; set; }
            public bool BooleanValue { get; set; }
            public bool? NullableBooleanValue { get; set; }
            public DateTime DateTimeValue { get; set; }
        }

    }
}