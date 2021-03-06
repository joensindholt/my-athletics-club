using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.MarsEvents;
using MyAthleticsClub.Core.Mocks;
using MyAthleticsClub.Core.Slack;
using NSubstitute;
using Xunit;

namespace MyAthleticsClub.UnitTests.Core.Services.MarsEvents
{
    public class MarsEventServiceTests
    {
        [Fact]
        public async Task CanUpdateEvents()
        {
            // Arrange
            var httpClient = new MockedHttpClientAdapter();
            var marsEventRepository = Substitute.For<IMarsEventRepository>();
            var marsParserFactory = new MarsParserFactory(httpClient);
            var resultService = Substitute.For<IResultService>();
            var slackService = Substitute.For<ISlackService>();
            var logger = Substitute.For<ILogger<MarsEventService>>();

            var marsEventService =
                new MarsEventService(
                    marsEventRepository,
                    marsParserFactory,
                    resultService,
                    slackService,
                    logger);

            // Act
            await marsEventService.UpdateEventsAsync(new JobCancellationToken(false));

            // Assert

            // Check for MarsNet parser returning events
            await marsEventRepository
                .Received(1)
                .AddEventsAsync(Arg.Is<IEnumerable<MarsEvent>>(events => events.All(e => e.Parser == "MarsNet")), CancellationToken.None);

            // Check for iMars parser returning events
            await marsEventRepository
                .Received(1)
                .AddEventsAsync(Arg.Is<IEnumerable<MarsEvent>>(events => events.Any(e => e.Parser == "iMars")), CancellationToken.None);
        }
    }
}
