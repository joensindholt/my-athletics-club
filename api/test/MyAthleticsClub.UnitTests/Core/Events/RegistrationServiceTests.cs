using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Core.Email;
using MyAthleticsClub.Core.Events;
using MyAthleticsClub.Core.Members;
using MyAthleticsClub.Core.Slack;
using MyAthleticsClub.Core.Utilities;
using NSubstitute;
using Xunit;

namespace MyAthleticsClub.UnitTests.Core.Events
{
    public class RegistrationServiceTests
    {
        private readonly RegistrationService _registrationService;
        private readonly IMemberRepository _memberRepository;
        private readonly IEventService _eventService;
        private IOptions<EmailOptions> _emailOptions;
        private string _eventId;
        private Registration _registration;
        private readonly IEmailService _emailService;

        public RegistrationServiceTests()
        {
            _eventId = "TestEventId";

            _eventService = Substitute.For<IEventService>();
            _eventService.GetAsync("gik", _eventId).Returns(Task.FromResult(new Event
            {
                MaxDisciplinesAllowed = 3
            }));

            _emailService = Substitute.For<IEmailService>();
            _emailOptions = Options.Create<EmailOptions>(new EmailOptions
            {
                Templates = new EmailTemplates()
            });

            _memberRepository = Substitute.For<IMemberRepository>();
            _memberRepository.GetActiveMembersAsync("gik").Returns(Task.FromResult(new List<Member>
            {
                new Member
                {
                    Name = "Existing member name"
                }
            }
            .AsEnumerable()));

            _registrationService = new RegistrationService(
                new IdGenerator(),
                _emailService,
                _emailOptions,
                Substitute.For<IEventRegistrationsExcelService>(),
                _eventService,
                Substitute.For<IRegistrationRepository>(),
                _memberRepository,
                Substitute.For<ISlackService>(),
                Substitute.For<IMemoryCache>(),
                Substitute.For<ILogger<RegistrationService>>());
        }

        [Theory]
        [InlineData("Non existing member name", true)]
        [InlineData("Existing member name", false)]
        public async Task AddRegistrationAsync_SendsNotification_WhenRegistrationNameDoesNotMatchMemberName(
            string name,
            bool shouldSend)
        {
            // arrange
            _registration = new Registration(
                "TestRegistrationId",
                _eventId,
                name,
                "TestEmail",
                "TestAgeClass",
                "TestBirthYear",
                new List<RegistrationDiscipline>(),
                new List<RegistrationExtraDiscipline>(),
                DateTimeOffset.Now);

            // Act
            await _registrationService.AddRegistrationAsync(_eventId, _registration, CancellationToken.None);

            // Assert
            if (shouldSend)
            {
                await _emailService.Received().SendMarkdownEmail(
                    Arg.Any<string>(),
                    "Mulig mistænkelig tilmelding",
                    Arg.Any<string>(),
                    Arg.Any<object>(),
                    Arg.Any<CancellationToken>());
            }
            else
            {
                await _emailService.DidNotReceiveWithAnyArgs().SendMarkdownEmail(
                    default,
                    default,
                    default,
                    default,
                    default);
            }
        }
    }
}
