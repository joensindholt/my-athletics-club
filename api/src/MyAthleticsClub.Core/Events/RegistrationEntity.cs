using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.Events
{
    public class RegistrationEntity : TableEntity
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string AgeClass { get; set; }
        public string BirthYear { get; set; }
        public string DisciplinesJson { get; set; }
        public string ExtraDisciplinesJson { get; set; }

        public RegistrationEntity()
        {
            ETag = "*";
        }

        public RegistrationEntity(
            string id,
            string eventId,
            string name,
            string email,
            string ageClass,
            string birthYear,
            string disciplinesJson,
            string extraDisciplinesJson
            ) : base(eventId, id)
        {
            ETag = "*";

            Name = name;
            Email = email;
            AgeClass = ageClass;
            BirthYear = birthYear;
            DisciplinesJson = disciplinesJson;
            ExtraDisciplinesJson = extraDisciplinesJson;
        }
    }
}
