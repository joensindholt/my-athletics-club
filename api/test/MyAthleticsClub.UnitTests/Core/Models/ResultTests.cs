using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.MarsEvents;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace MyAthleticsClub.UnitTests.Core.Models
{
    public class ResultTests
    {
        private readonly ILogger logger;

        public ResultTests()
        {
            logger = NSubstitute.Substitute.For<ILogger>();
        }

        [Fact]
        public void FromMarsEvents_ReturnsFinalPosition_WhenDisciplineHasMultipleStages()
        {
            // Arrange
            var marsResults = new List<MarsEvent.Result>
            {
                new MarsEvent.Result
                {
                    Event = "60 m - Round 1",
                    Group = "D11",
                    Name = "Johnny",
                    Position = "1",
                    Value = "123",
                    DayAndTime = "1 - 10:00",
                    YearOfBirth = "12"
                },
                new MarsEvent.Result
                {
                    Event = "60 m - Final",
                    Group = "D11",
                    Name = "Johnny",
                    Position = "3",
                    Value = "123",
                    DayAndTime = "1 - 11:00",
                    YearOfBirth = "12"
                }
            };

            var marsEvents = new List<MarsEvent>
            {
                new MarsEvent(
                    "1",
                    "Afslutningsstævne • 2017 Sep 30 - Oct 01 • Greve Stadion • Greve",
                    "link",
                    marsResults,
                    "parser")
            };

            // Act
            var results = Result.FromMarsEvents(marsEvents, logger);

            // Assert
            Assert.Equal(3, results.LastEvent.Results.First().Position);
        }

        [Fact]
        public void FromMarsEvents_ReturnsAllRelayResults_WhenDisciplineHasRelays()
        {
            // Arrange
            var marsResults = new List<MarsEvent.Result>
            {
                new MarsEvent.Result
                {
                    Event = "4 x 200 meter stafet",
                    Group = "Piger 11 år",
                    Name = "Gentofte IK",
                    Position = "1",
                    Value = "123",
                    DayAndTime = "1 - 10:00",
                    YearOfBirth = "12"
                },
                new MarsEvent.Result
                {
                    Event = "4 x 200 meter stafet",
                    Group = "Drenge 11 år",
                    Name = "Gentofte IK",
                    Position = "3",
                    Value = "123",
                    DayAndTime = "1 - 11:00",
                    YearOfBirth = "12"
                }
            };

            var marsEvents = new List<MarsEvent>
            {
                new MarsEvent(
                    "1",
                    "Afslutningsstævne • 2017 Sep 30 - Oct 01 • Greve Stadion • Greve",
                    "link",
                    marsResults,
                    "parser")
            };

            // Act
            var results = Result.FromMarsEvents(marsEvents, logger);

            // Assert
            Assert.Equal(2, results.LastEvent.Results.Count());
            Assert.Equal("Piger 11 år", results.LastEvent.Results.First().AgeGroup);
            Assert.Equal("Drenge 11 år", results.LastEvent.Results.Skip(1).First().AgeGroup);
        }
    }
}
