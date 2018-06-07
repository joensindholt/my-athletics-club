using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.MarsEvents;
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
                new MarsEvent.Result { Event = "60 m - Round 1", Group = "D11", Name = "Johnny", Position = "1", Value = "123", DayAndTime = "1 - 10:00", YearOfBirth = "12" },
                new MarsEvent.Result { Event = "60 m - Final", Group = "D11", Name = "Johnny", Position = "3", Value = "123", DayAndTime = "1 - 11:00", YearOfBirth = "12" }
            };

            var marsEvents = new List<MarsEvent>
            {
                new MarsEvent("1", "Afslutningsstævne • 2017 Sep 30 - Oct 01 • Greve Stadion • Greve", "link", marsResults, "parser")
            };

            // Act
            var results = Result.FromMarsEvents(marsEvents, logger);

            // Assert
            Assert.Equal(3, results.LastEvent.Results.First().Position);
        }
    }
}
