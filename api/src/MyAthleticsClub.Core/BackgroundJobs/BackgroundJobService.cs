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
            _recurringJobManager = recurringJobManager ?? throw new ArgumentException("Missing dependency", nameof(recurringJobManager));
            _memberService = memberService ?? throw new ArgumentException("Missing dependency", nameof(memberService));
            _logger = logger ?? throw new ArgumentException("Missing dependency", nameof(logger));
        }

        public void Initialize()
        {
            _logger.LogInformation("Adding recurring job notifying about fourteen day members");

            var atTenAmEveryDay = "0 10 * * *";

            _recurringJobManager.AddOrUpdate(
                recurringJobId: "14DayMemberNotification",
                job: Job.FromExpression(() => _memberService.NotifyFourteenDayMembers()),
                cronExpression: atTenAmEveryDay,
                timeZone: TimeZoneInfo.FindSystemTimeZoneById("CET"));
        }
    }
}
