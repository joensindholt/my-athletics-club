using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.Mocks;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Services.MarsEvents;
using NSubstitute;
using NUnit.Framework;

namespace MyAthleticsClub.UnitTests.Core.Services.MarsEvents
{
    [TestFixture]
    public class MarsEventServiceTests
    {
        [Test]
        public async Task CanParseLiveBoard()
        {
            // Arrange
            var marsEventService = BuildMarsEventService();

            // Act
            var events = await marsEventService.ParseEventsAsync(stopAtMeetId: null, cancellationToken: CancellationToken.None);

            // Assert
            Assert.That(events, Is.Not.Empty);

            var firstResult = events.Skip(1).First();
            Assert.That(firstResult.Link, Is.EqualTo("/Liveboard/Events?meetId=dd9afb58-f411-4d39-9888-a396e797d69f"));
            Assert.That(firstResult.MeetId, Is.EqualTo("dd9afb58-f411-4d39-9888-a396e797d69f"));
            Assert.That(firstResult.Title, Is.EqualTo("Copenhagen Games & DM mangekamp • 2017 Aug 19 - Aug 20 • Østerbro Stadion • København"));

            var firstResultValue = firstResult.Results.First();
            Assert.That(firstResultValue.DayAndTime, Is.EqualTo("1 - 10:00"));
            Assert.That(firstResultValue.Event, Is.EqualTo("100 meter - indledende"));
            Assert.That(firstResultValue.Group, Is.EqualTo("Drenge 14-15 år"));
            Assert.That(firstResultValue.Name, Is.EqualTo("Aske Hippe Brun"));
            Assert.That(firstResultValue.Position, Is.EqualTo("4"));
            Assert.That(firstResultValue.QualifyingTime, Is.EqualTo("12.66"));
            Assert.That(firstResultValue.Value, Is.EqualTo("12.97"));
            Assert.That(firstResultValue.YearOfBirth, Is.EqualTo("2002"));
        }

        [Test]
        public async Task CanGetDateOfAllEvents()
        {
            // Arrange
            var marsEventService = BuildMarsEventService();

            // Act
            var results = await marsEventService.ParseEventsAsync(stopAtMeetId: null, cancellationToken: CancellationToken.None);

            // Assert
            foreach (var result in results)
            {
                Assert.That(result.GetDate(), Is.TypeOf<DateTime>());
            }

            Assert.That(results.First().GetDate(), Is.EqualTo(new DateTime(2017, 9, 9)));
            Assert.That(results.Skip(1).First().GetDate(), Is.EqualTo(new DateTime(2017, 8, 19)));
        }

        private MarsEventService BuildMarsEventService()
        {
            var httpClient = new MockedHttpClientAdapter();

            var service =
                new MarsEventService(
                    Substitute.For<IMarsEventRepository>(),
                    Substitute.For<IResultService>(),
                    httpClient,
                    Substitute.For<ILogger<MarsEventService>>());

            return service;
        }
    }
}
