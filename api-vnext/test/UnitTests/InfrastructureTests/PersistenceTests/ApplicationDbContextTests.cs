using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.WindowsAzure.Storage.Table;
using Moq;
using MyAthleticsClub.Api.Domain.Entities;
using MyAthleticsClub.Api.Infrastructure.AzureTableStorage;
using MyAthleticsClub.Api.Infrastructure.Persistence;
using Xunit;

namespace MyAthleticsClub.Api.UnitTests.InfrastructureTests.PersistenceTests
{
    public class ApplicationDbContextTests
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<IAzureTableStorageRepository> _azureTableStorageRepositoryMock;

        public ApplicationDbContextTests()
        {
            _azureTableStorageRepositoryMock = new Mock<IAzureTableStorageRepository>();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("Fake");

            _context = new ApplicationDbContext(optionsBuilder.Options, _azureTableStorageRepositoryMock.Object);
        }

        [Fact]
        public async Task Add_AddsEntityToContext()
        {
            // Arrange
            var name = "John Doe";

            var addedMembers = new List<Member>();

            _azureTableStorageRepositoryMock
                .Setup(m => m.Add(It.IsAny<object>()))
                .Callback((object obj) =>
                {
                    addedMembers.Add((Member)obj);
                });

            // Act
            _context.Members.Add(new Member(name));

            await _context.SaveChangesAsync();

            // Assert
            Assert.Single(addedMembers);
            Assert.Equal(name, addedMembers[0].Name);
        }
    }
}