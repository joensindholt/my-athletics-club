using System;
using Hangfire;
using Hangfire.Common;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.Members;

namespace MyAthleticsClub.Core.BackgroundJobs
{
    public class BackgroundJobService : IBackgroundJobService
    {
        private readonly IRecurringJobManager _recurringJobManager;
        private readonly IMemberService _memberService;
        private readonly ILogger<BackgroundJobService> _logger;

        public BackgroundJobService(
            IRecurringJobManager recurringJobManager,
            IMemberService memberService,
            ILogger<BackgroundJobService> logger)
        {
            _recurringJobManager = recurringJobManager;
            _memberService = memberService;
            _logger = logger;
        }

        public void Initialize()
        {
            _logger.LogInformation("Adding recurring job notifying about fourteen day members");

            var atTenAmEveryDay = "0 10 * * *";

            _recurringJobManager.AddOrUpdate(
                recurringJobId: "14DayMemberNotification",
                job: Job.FromExpression(() => _memberService.NotifyFourteenDayMembers(JobCancellationToken.Null.ShutdownToken)),
                cronExpression: atTenAmEveryDay,
                timeZone: TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time"));
        }
    }
}
