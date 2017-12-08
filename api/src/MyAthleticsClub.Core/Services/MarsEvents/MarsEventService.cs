using System;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Services.MarsEvents
{
    public class MarsEventService : IMarsEventService
    {
        private readonly IMarsEventRepository _marsEventRepository;
        private readonly IMarsParserFactory _marsParserFactory;
        private readonly IResultService _resultService;
        private readonly ISlackService _slackService;
        private readonly ILogger<MarsEventService> _logger;

        public MarsEventService(
            IMarsEventRepository marsEventRepository,
            IMarsParserFactory marsParserFactory,
            IResultService resultService,
            ISlackService slackService,
            ILogger<MarsEventService> logger)
        {
            _marsEventRepository = marsEventRepository;
            _marsParserFactory = marsParserFactory;
            _resultService = resultService;
            _slackService = slackService;
            _logger = logger;
        }

        public async Task UpdateEventsAsync(IJobCancellationToken jobCancellationToken)
        {
            IMarsParser parserRef = null;

            try
            {
                _logger.LogInformation("Updating events from MarsNet");

                var parsers = _marsParserFactory.GetParsers();

                foreach (IMarsParser parser in parsers)
                {
                    parserRef = parser;

                    var lastRetrievedEvent = await _marsEventRepository.GetLastRetrievedEventAsync("gik", parser.Name, jobCancellationToken.ShutdownToken);
                    _logger.LogInformation("Last retrieved event '{Event}' for parser '{Parser}'", lastRetrievedEvent?.Title, parser.Name);

                    var newEvents = await parser.ParseEventsAsync(stopAtMeetId: lastRetrievedEvent?.MeetId, cancellationToken: jobCancellationToken.ShutdownToken);

                    _logger.LogInformation("Adding {Count} new events", newEvents.Count());
                    await _marsEventRepository.AddEventsAsync(newEvents, jobCancellationToken.ShutdownToken);
                }

                await _resultService.UpdateResultsAsync(jobCancellationToken.ShutdownToken);

                _logger.LogInformation("Updating done");
            }
            catch (Exception ex)
            {
                await
                    _slackService.SendMessageAsync($"An error occured getting events for Mars parser {parserRef.Name}. " +
                        $"The error was: {ex.Message}. Stacktrace: {ex.StackTrace}", jobCancellationToken.ShutdownToken);

                throw;
            }
        }
    }
}
