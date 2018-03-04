using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.Events;
using NSubstitute;
using Xunit;

namespace MyAthleticsClub.UnitTests.Core.Services
{
    public class EventServiceTests
    {
        [Fact]
        public async Task GetsEventsFromDataStoreWhenCacheIsEmpty()
        {
            // Arrange
            var sut = BuildSut();
            var organizationId = "123";
            var cacheKey = "events_123";
            var repositoryEvents = new List<Event> { new Event(), new Event() };

            sut.memoryCache.TryGetValue(cacheKey, out IEnumerable<Event> cacheEvents)
                .Returns(false);

            sut.eventRepository.GetAllByPartitionKey(organizationId)
                .Returns(repositoryEvents);

            // Act
            var events = await sut.eventService.GetAllAsync(organizationId);

            // Assert
            await sut.eventRepository.Received(1).GetAllByPartitionKey(organizationId);
            Assert.Equal(repositoryEvents.Count, events.Count());
        }

        [Fact]
        public async Task ReturnsCachedEventsWhenCacheContainsEvents()
        {
            // Arrange
            var sut = BuildSut();
            var organizationId = "123";
            var cacheKey = "events_123";
            var repositoryEvents = new List<Event> { new Event(), new Event() };

            sut.memoryCache.TryGetValue(cacheKey, out IEnumerable<Event> cacheEvents)
                .Returns(x =>
                {
                    x[1] = repositoryEvents;
                    return true;
                });

            // Act
            var events = await sut.eventService.GetAllAsync(organizationId);

            // Assert
            await sut.eventRepository.DidNotReceive().GetAllByPartitionKey(organizationId);
            Assert.Equal(repositoryEvents.Count, events.Count());
        }

        private (EventService eventService, IMemoryCache memoryCache, IEventRepository eventRepository) BuildSut()
        {
            var cacheMock = Substitute.For<IMemoryCache>();
            var eventRepositoryMock = Substitute.For<IEventRepository>();
            var loggerMock = Substitute.For<ILogger<EventService>>();
            var eventService = new EventService(eventRepositoryMock, cacheMock, loggerMock);
            return (eventService, cacheMock, eventRepositoryMock);
        }
    }
}
