using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Core.Exceptions;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Email;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Utilities;

namespace MyAthleticsClub.Core.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IIdGenerator _idGenerator;
        private readonly IEmailService _emailService;
        private readonly EmailOptions _emailOptions;
        private readonly IEventRegistrationsExcelService _eventRegistrationsExcelService;
        private readonly IEventService _eventService;
        private readonly IRegistrationRepository _registrationRepository;
        private readonly ISlackService _slackService;
        private readonly ILogger<RegistrationService> _logger;

        public RegistrationService(
            IIdGenerator idGenerator,
            IEmailService emailService,
            IOptions<EmailOptions> emailOptions,
            IEventRegistrationsExcelService eventRegistrationsExcelService,
            IEventService eventService,
            IRegistrationRepository registrationRepository,
            ISlackService slackService,
            ILogger<RegistrationService> logger)
        {
            _idGenerator = idGenerator;
            _emailService = emailService;
            _emailOptions = emailOptions.Value;
            _eventRegistrationsExcelService = eventRegistrationsExcelService;
            _eventService = eventService;
            _registrationRepository = registrationRepository;
            _slackService = slackService;
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

                await SendRegistrationEmailReceiptAsync(registration, _event, cancellationToken);

                var message = new RegistrationSlackMessageBuilder().BuildAdvancedMessage(_event, registration);
                await _slackService.SendMessageAsync(message);
            }
            catch (Exception)
            {
                await _registrationRepository.DeleteRegistrationAsync(registration.EventId, registration.Id);
                throw;
            }

            return registration;
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

        public Task<IEnumerable<Registration>> GetEventRegistrationsAsync(string eventId)
        {
            return _registrationRepository.GetRegistrationsByEventIdAsync(eventId);
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
    }
}
