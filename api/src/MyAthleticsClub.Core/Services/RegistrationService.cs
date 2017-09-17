using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Core.Exceptions;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Utilities;

namespace MyAthleticsClub.Core.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IIdGenerator _idGenerator;
        private readonly IEventRegistrationsExcelService _eventRegistrationsExcelService;
        private readonly ISlackService _slackService;
        private readonly IEventService _eventService;
        private readonly IRegistrationRepository _registrationRepository;
        private readonly ILogger<RegistrationService> _logger;

        public RegistrationService(
            IIdGenerator idGenerator,
            IEventRegistrationsExcelService eventRegistrationsExcelService,
            ISlackService slackService,
            IEventService eventService,
            IRegistrationRepository registrationRepository,
            ILogger<RegistrationService> logger)
        {
            _idGenerator = idGenerator;
            _eventRegistrationsExcelService = eventRegistrationsExcelService;
            _slackService = slackService;
            _eventService = eventService;
            _registrationRepository = registrationRepository;
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

            await _registrationRepository.CreateAsync(registration);

            try
            {
                var message = new RegistrationSlackMessageBuilder().BuildAdvancedMessage(_event, registration);
                await _slackService.SendMessageAsync(message);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(new EventId(1, "SlackMessage"), ex, "An error occured sending Slack message regarding new registration");
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
    }
}
