using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.S3;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.Email;
using MyAthleticsClub.Core.Members.AddMember;
using MyAthleticsClub.Core.Members.GetMember;
using MyAthleticsClub.Core.Shared.Exceptions;
using MyAthleticsClub.Core.Slack;
using MyAthleticsClub.Core.Slug;

namespace MyAthleticsClub.Core.Members
{
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IMemberMessageRepository _memberMessageRepository;
        private readonly ISlackService _slackService;
        private readonly ISlugGenerator _slugGenerator;
        private readonly IEmailService _emailService;
        private readonly IAmazonS3 _s3Client;
        private readonly ILogger<MemberService> _logger;

        public MemberService(
            IMemberRepository memberRepository,
            IMemberMessageRepository memberMessageRepository,
            ISlackService slackService,
            ISlugGenerator slugGenerator,
            IEmailService emailService,
            IAmazonS3 s3Client,
            ILogger<MemberService> logger)
        {
            _memberRepository = memberRepository;
            _memberMessageRepository = memberMessageRepository;
            _slackService = slackService;
            _slugGenerator = slugGenerator;
            _emailService = emailService;
            _s3Client = s3Client;
            _logger = logger;
        }

        public async Task<IEnumerable<Member>> GetActiveMembersAsync(string organizationId)
        {
            return await _memberRepository.GetActiveMembersAsync(organizationId);
        }

        public async Task<IEnumerable<Member>> GetTerminatedMembersAsync(string organizationId)
        {
            return await _memberRepository.GetTerminatedMembersAsync(organizationId);
        }

        public async Task<GetMemberResponse> GetAsync(string organizationId, string id)
        {
            var member = await _memberRepository.GetAsync(organizationId, id);
            var messages = await _memberMessageRepository.GetMemberMessages(member.Id);
            return new GetMemberResponse(member, messages);
        }

        public async Task<AddMemberResponse> CreateAsync(AddMemberRequest request, CancellationToken cancellationToken)
        {
            if (request.WelcomeMessage.Send && string.IsNullOrWhiteSpace(request.Member.Email))
            {
                throw new BadRequestException("Sending a welcome message to a member without an email is not possible");
            }

            request.Member.Id = Guid.NewGuid().ToString();
            request.Member.Number = await GetNextMemberNumberAsync(request.Member.OrganizationId);

            await _memberRepository.CreateAsync(request.Member);

            bool welcomeMessageSent = false;
            bool welcomeMessageRegistered = false;
            if (request.WelcomeMessage.Send)
            {
                try
                {
                    var welcomeMessageMergeData = new
                    {
                        member_name = request.Member.Name,
                        member_number = request.Member.Number,
                        latest_payment_date = DateTime.Now.Date.AddDays(14).ToString(
                            "dddd \\den d\\/M",
                            CultureInfo.GetCultureInfo("da-DK"))
                    };

                    // Send the welcome message
                    var message = await _emailService.SendMarkdownEmail(
                        to: request.Member.GetAllEmailAddresses(),
                        subject: request.WelcomeMessage.Subject,
                        template: request.WelcomeMessage.Template,
                        data: welcomeMessageMergeData,
                        cancellationToken);

                    welcomeMessageSent = true;

                    // Register the sent mail on the member for showing it in "Sent messages" on the member
                    await _memberMessageRepository.CreateAsync(new MemberMessage(
                        memberId: request.Member.Id,
                        to: string.Join(", ", message.To),
                        subject: message.Subject,
                        htmlContent: message.HtmlContent,
                        sent: message.Sent),
                        cancellationToken);

                    welcomeMessageRegistered = true;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occured sending welcome message to user");
                }
            }

            return new AddMemberResponse(request.Member, welcomeMessageSent, welcomeMessageRegistered);
        }

        public async Task UpdateAsync(Member member)
        {
            await _memberRepository.UpdateAsync(member);
        }

        private async Task<string> GetNextMemberNumberAsync(string organizationId)
        {
            return await _memberRepository.GetNextMemberNumberAsync(organizationId);
        }

        public async Task ChargeMembersAsync(string organizationId)
        {
            await _memberRepository.ChargeMembersAsync(organizationId);
        }

        public async Task TerminateMembershipAsync(string organizationId, TerminateMembershipRequest command)
        {
            await _memberRepository.SetTerminationDate(organizationId, command.MemberId, command.TerminationDate);
        }

        public async Task<MemberStatistics> GetStatistics(string organizationId, DateTime date)
        {
            return await _memberRepository.GetStatistics(organizationId, date);
        }

        public async Task<MemberStatistics> GetStatisticsCfr(string organizationId, int year)
        {
            var allMembers = await _memberRepository.GetAllAsync(organizationId);

            var yearStart = new DateTime(year, 1, 1);
            var yearEnd = new DateTime(year + 1, 1, 1).AddDays(-1);

            var threeMonthMembers = allMembers.Where(m => m.HasMonthsOfMembershipInYear(year, 3));

            var membersByAge =
                threeMonthMembers
                    .Where(m => m.BirthDate.HasValue)
                    .GroupBy(m => m.GetAge(DateTime.Now))
                    .ToDictionary(
                        i => i.Key,
                        i => i
                    );

            if (!membersByAge.Any())
            {
                return new MemberStatistics();
            }

            var minAge = membersByAge.Min(m => m.Key);
            var maxAge = membersByAge.Max(m => m.Key);

            var statistics = new MemberStatistics(threeMonthMembers);
            for (var age = minAge; age <= maxAge; age++)
            {
                int females = 0;
                int males = 0;

                if (membersByAge.ContainsKey(age))
                {
                    females = membersByAge[age].Count(m => m.Gender == Gender.Female);
                    males = membersByAge[age].Count(m => m.Gender == Gender.Male);
                }

                var entry = new MemberStatisticsEntry(age, females, males);

                statistics.AddEntry(entry);
            }

            return statistics;
        }

        public async Task<int> GetAvailableFamilyMembershipNumberAsync(string organizationId)
        {
            return await _memberRepository.GetAvailableFamilyMembershipNumberAsync(organizationId);
        }

        public async Task NotifyFourteenDayMembers()
        {
            _logger.LogInformation($"Notifying Glennie about new members");

            var days = 14;
            var fourteenDaysAgo = DateTime.UtcNow.Date.AddDays(-days);

            var members = await _memberRepository.GetActiveMembersByStartDateAsync(fourteenDaysAgo);

            _logger.LogInformation($"Found {members.Count()} members");

            if (members.Any())
            {
                var message = new
                {
                    channel = "@glenniesindholt",
                    text = $"Følgende medlemmer blev indmeldt for {days} dage siden\n\n" +
                        string.Join("\n", members.OrderBy(n => n.Name).Select(m => m.Name)) + "\n\n" +
                        "Med venlig hilsen\nGIK's medlemssystem"
                };

                await _slackService.SendMessageAsync(message);
            }
        }
    }
}
