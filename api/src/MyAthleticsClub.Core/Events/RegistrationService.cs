using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Core.Email;
using MyAthleticsClub.Core.Members;
using MyAthleticsClub.Core.Shared.Exceptions;
using MyAthleticsClub.Core.Slack;
using MyAthleticsClub.Core.Utilities;

namespace MyAthleticsClub.Core.Events
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IIdGenerator _idGenerator;
        private readonly IEmailService _emailService;
        private readonly EmailOptions _emailOptions;
        private readonly IEventRegistrationsExcelService _eventRegistrationsExcelService;
        private readonly IEventService _eventService;
        private readonly IRegistrationRepository _registrationRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly ISlackService _slackService;
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<RegistrationService> _logger;

        public RegistrationService(
            IIdGenerator idGenerator,
            IEmailService emailService,
            IOptions<EmailOptions> emailOptions,
            IEventRegistrationsExcelService eventRegistrationsExcelService,
            IEventService eventService,
            IRegistrationRepository registrationRepository,
            IMemberRepository memberRepository,
            ISlackService slackService,
            IMemoryCache memoryCache,
            ILogger<RegistrationService> logger)
        {
            _idGenerator = idGenerator;
            _emailService = emailService;
            _emailOptions = emailOptions.Value;
            _eventRegistrationsExcelService = eventRegistrationsExcelService;
            _eventService = eventService;
            _registrationRepository = registrationRepository;
            _memberRepository = memberRepository;
            _slackService = slackService;
            _memoryCache = memoryCache;
            _logger = logger;
        }

        public async Task<Registration> AddRegistrationAsync(string eventId, Registration registration, CancellationToken cancellationToken)
        {
            eventId.VerifyNotNullOrWhiteSpace("eventId");
            registration.VerifyNotNull("registration");

            var _event = await _eventService.GetAsync("gik", eventId);

            VerifyRegistrationDisciplinesCountNotAboveAllowed(registration, _event);

            registration.Id = _idGenerator.GenerateId();
            registration.EventId = eventId;

            try
            {
                await _registrationRepository.CreateAsync(registration);
                InvalidateCache(registration.EventId, registration.Id);

                await SendRegistrationEmailReceiptAsync(registration, _event, cancellationToken);

                try
                {
                    if (!(await MemberWithNameExists(registration.Name)))
                    {
                        await SendRegistrationByUnknownMemberNotificationAsync(registration, _event, cancellationToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occured doing suspicious registration check." +
                        " The registration completed, but you should look into why this is failing");
                }

                var message = new RegistrationSlackMessageBuilder().BuildAdvancedMessage(_event, registration);
                await _slackService.SendMessageAsync(message);
            }
            catch (Exception)
            {
                await _registrationRepository.DeleteRegistrationAsync(registration.EventId, registration.Id);
                InvalidateCache(registration.EventId, registration.Id);
                throw;
            }

            return registration;
        }

        public async Task<IEnumerable<Registration>> GetEventRegistrationsAsync(string eventId)
        {
            if (!_memoryCache.TryGetValue(GetCacheKey(eventId), out IEnumerable<Registration> registrations))
            {
                _logger.LogInformation($"Registrations for event '{eventId}' not found in cache. Retrieving from data store");
                registrations = await _registrationRepository.GetRegistrationsByEventIdAsync(eventId);
                _memoryCache.Set(GetCacheKey(eventId), registrations);
            }

            return registrations;
        }

        public async Task<byte[]> GetEventRegistrationsAsXlsxAsync(string eventId)
        {
            var events = await GetEventRegistrationsAsync(eventId);
            return _eventRegistrationsExcelService.GetEventRegistrationsAsXlsx(events);
        }

        public async Task SendRegistrationEmailReceiptAsync(Registration registration, Event _event, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(registration.Email))
            {
                throw new Exception($"Could not send email to registrant {registration.Name} because no email address was found");
            }

            await _emailService.SendTemplateEmailAsync(
                to: registration.Email,
                templateId: _emailOptions.Templates.EventRegistrationReceipt,
                data: new
                {
                    Registration = registration,
                    Event = _event,
                    Date = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss")
                },
                cancellationToken: cancellationToken);
        }

        private void VerifyRegistrationDisciplinesCountNotAboveAllowed(Registration registration, Event _event)
        {
            var selectedDisciplinesCount = registration.Disciplines?.Count + registration.ExtraDisciplines?.Count;
            var maxDisciplinesAllowed = _event.MaxDisciplinesAllowed;
            if (selectedDisciplinesCount > maxDisciplinesAllowed)
            {
                throw new BadRequestException($"The number of selected disciplines '{selectedDisciplinesCount}' is higher than the event allows, which is '{maxDisciplinesAllowed}'");
            }
        }

        private string GetCacheKey(string eventId, string id = null)
        {
            if (id == null)
            {
                return $"registrations_{eventId}";
            }
            else
            {
                return $"registrations_{eventId}_{id}";
            }
        }

        private void InvalidateCache(string eventId, string id = null)
        {
            _memoryCache.Remove(GetCacheKey(eventId));

            if (id != null)
            {
                _memoryCache.Remove(GetCacheKey(eventId, id));
            }
        }

        private async Task<bool> MemberWithNameExists(string name)
        {
            var members = await _memberRepository.GetActiveMembersAsync("gik");
            return members.Any(m => string.Equals(m.Name, name, StringComparison.InvariantCultureIgnoreCase));
        }

        private async Task SendRegistrationByUnknownMemberNotificationAsync(
            Registration registration,
            Event _event,
            CancellationToken cancellationToken)
        {
            var data = new
            {
                member_name = registration.Name,
                event_title = _event.Title
            };

            await _emailService.SendMarkdownEmail(
                to: new List<string> { "joensindholt@gmail.com" },
                subject: "Mulig mistænkelig tilmelding",
                template:
@"En person ved navn '{{member_name}}' har tilmeldt sig til stævnet '{{event_title}}' via hjemmesiden.

Der er imidlertid ikke noget aktivt medlem med dette navn?!

Med venlig hilsen
GIK's medlemssystem",
                 data: data,
                 cancellationToken);
        }
    }
}
