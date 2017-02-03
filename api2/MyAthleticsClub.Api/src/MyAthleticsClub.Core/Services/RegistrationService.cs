using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
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

            registration.Id = _idGenerator.GenerateId();
            registration.EventId = eventId;

            await _registrationRepository.CreateAsync(registration);

            try
            {
                string message = await GetSlackMessageForRegistrationAsync(eventId, registration, cancellationToken);
                await _slackService.SendMessageAsync(message);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(new EventId(1, "SlackMessage"), ex, "An error occured sending Slack message regarding new registration");
            }

            return registration;
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

        private async Task<string> GetSlackMessageForRegistrationAsync(string eventId, Registration registration, CancellationToken cancellationToken)
        {
            var _event = await _eventService.GetAsync("gik", eventId);
            string message = $"*Tilmelding modtaget*\nNavn: {registration.Name}\nStævne: {_event.Title}\nAldersklasse {registration.AgeClass}\nEmail: {registration.Email}\nDiscipliner:\n{GetSlackMessageDisciplineList(registration)}";
            return message;
        }

        private string GetSlackMessageDisciplineList(Registration registration)
        {
            StringBuilder sb = new StringBuilder();

            int i = 0;
            foreach (var discipline in registration.Disciplines)
            {
                sb.Append($"- {discipline.Name}");

                if (i != registration.Disciplines.Count - 1)
                {
                    sb.Append("\n");
                }

                i++;
            }

            i = 0;
            foreach (var discipline in registration.ExtraDisciplines)
            {
                sb.Append($"- {discipline.Name} ({discipline.AgeClass})");

                if (i != registration.Disciplines.Count - 1)
                {
                    sb.Append("\n");
                }

                i++;
            }

            return sb.ToString();
        }
    }
}
