using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json;

namespace MyAthleticsClub.Core.Events
{
    public class RegistrationRepository : AzureStorageRepository<Registration, RegistrationEntity>, IRegistrationRepository
    {
        public RegistrationRepository(CloudStorageAccount account)
            : base(account, "registrations")
        {
        }

        public async Task<IEnumerable<Registration>> GetRegistrationsByEventIdAsync(string eventId)
        {
            return await base.GetAllByPartitionKeyInternalAsync(eventId);
        }

        public async Task DeleteRegistrationAsync(string eventId, string id)
        {
            await base.DeleteInternalAsync(eventId, id);
        }

        public Task CreateAsync(Registration registration)
        {
            return CreateInternalAsync(registration);
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
                entity.ExtraDisciplinesJson != null ? JsonConvert.DeserializeObject<List<RegistrationExtraDiscipline>>(entity.ExtraDisciplinesJson) : new List<RegistrationExtraDiscipline>(),
                entity.Timestamp
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
    }
}
