using System;
using Hangfire;
using Hangfire.Common;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.MarsEvents;

namespace MyAthleticsClub.Core.BackgroundJobs
{
    public class BackgroundJobService : IBackgroundJobService
    {
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly IRecurringJobManager _recurringJobManager;
        private readonly IMarsEventService _marsEventService;
        private readonly ILogger<BackgroundJobService> _logger;

        public BackgroundJobService(
            IBackgroundJobClient backgroundJobClient,
            IRecurringJobManager recurringJobManager,
            IMarsEventService marsEventService,
            ILogger<BackgroundJobService> logger)
        {
            _backgroundJobClient = backgroundJobClient;
            _recurringJobManager = recurringJobManager;
            _marsEventService = marsEventService;
            _logger = logger;
        }

        public void Initialize()
        {
            var atMidnightAndNoonEveryDay = "0 0,12 * * *";

            // Run the event result parsing one minute after server start
            _backgroundJobClient.Schedule(() => _marsEventService.UpdateEventsAsync(JobCancellationToken.Null), TimeSpan.FromMinutes(1));

            // ...then run the parsing recurringly at noon and midnight
            _recurringJobManager.AddOrUpdate(
                recurringJobId: "MarsEvents",
                job: Job.FromExpression(() => _marsEventService.UpdateEventsAsync(JobCancellationToken.Null)),
                cronExpression: atMidnightAndNoonEveryDay,
                timeZone: TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time"));

            _logger.LogInformation("Configured event result parsing to run recurringly using cron expression: {Cron}", atMidnightAndNoonEveryDay);
        }
    }
}
