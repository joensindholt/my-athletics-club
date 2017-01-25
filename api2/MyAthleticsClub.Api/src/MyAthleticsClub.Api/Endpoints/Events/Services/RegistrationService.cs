using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Api.Slack;
using MyAthleticsClub.Api.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Events
{
    public class RegistrationService : AzureStorageService<Registration, RegistrationEntity>, IRegistrationService
    {
        private readonly IIdGenerator _idGenerator;
        private readonly IEventRegistrationsExcelService _eventRegistrationsExcelService;
        private readonly ISlackService _slackService;
        private readonly ILogger<RegistrationService> _logger;
        private readonly IEventService _eventService;

        public RegistrationService(
            IConfigurationRoot configuration,
            IIdGenerator idGenerator,
            IEventRegistrationsExcelService eventRegistrationsExcelService,
            ISlackService slackService,
            IEventService eventService,
            ILogger<RegistrationService> logger)
            : base(configuration, "registrations")
        {
            _idGenerator = idGenerator;
            _eventRegistrationsExcelService = eventRegistrationsExcelService;
            _slackService = slackService;
            _logger = logger;
            _eventService = eventService;
        }

        public async Task<Registration> AddRegistrationAsync(string eventId, Registration registration, CancellationToken cancellationToken)
        {
            eventId.VerifyNotNullOrWhiteSpace();

            registration.Id = _idGenerator.GenerateId();
            registration.EventId = eventId;

            await base.CreateAsync(registration);

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
            return GetAllByPartitionKeyAsync(eventId);
        }

        public async Task<byte[]> GetEventRegistrationsAsXlsxAsync(string eventId)
        {
            var events = await GetEventRegistrationsAsync(eventId);
            return _eventRegistrationsExcelService.GetEventRegistrationsAsXlsx(events);
        }

        protected override Registration ConvertEntityToObject(RegistrationEntity entity)
        {
            return new Registration(
                entity.RowKey,
                entity.PartitionKey,
                entity.Name,
                entity.Email,
                entity.AgeClass,
                entity.BirthYear,
                entity.DisciplinesJson != null ? JsonConvert.DeserializeObject<List<RegistrationDiscipline>>(entity.DisciplinesJson) : new List<RegistrationDiscipline>(),
                entity.ExtraDisciplinesJson != null ? JsonConvert.DeserializeObject<List<RegistrationExtraDiscipline>>(entity.ExtraDisciplinesJson) : new List<RegistrationExtraDiscipline>()
            );
        }

        protected override RegistrationEntity ConvertObjectToEntity(Registration registration)
        {
            return new RegistrationEntity(
                registration.Id,
                registration.EventId,
                registration.Name,
                registration.Email,
                registration.AgeClass,
                registration.BirthYear,
                registration.Disciplines != null ? JsonConvert.SerializeObject(registration.Disciplines) : null,
                registration.ExtraDisciplines != null ? JsonConvert.SerializeObject(registration.ExtraDisciplines) : null
            );
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