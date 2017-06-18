using System;
using System.Collections.Generic;
using MyAthleticsClub.Core.Repositories.Interfaces;

namespace MyAthleticsClub.Core.Models
{
    public class Registration : IEntityObject
    {
        public string Id { get; set; }
        public string EventId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string AgeClass { get; set; }
        public string BirthYear { get; set; }
        public List<RegistrationDiscipline> Disciplines { get; set; }
        public List<RegistrationExtraDiscipline> ExtraDisciplines { get; set; }
        public DateTimeOffset Timestamp { get; }

        public Registration()
        {
        }

        public Registration(
            string id,
            string eventId,
            string name,
            string email,
            string ageClass,
            string birthYear,
            List<RegistrationDiscipline> disciplines,
            List<RegistrationExtraDiscipline> extraDisciplines,
            DateTimeOffset timestamp)
            : this()
        {
            Id = id;
            EventId = eventId;
            Name = name;
            Email = email;
            AgeClass = ageClass;
            BirthYear = birthYear;
            Disciplines = disciplines;
            ExtraDisciplines = extraDisciplines;
            Timestamp = timestamp;
        }

        public string GetPartitionKey()
        {
            return EventId;
        }

        public string GetRowKey()
        {
            return Id;
        }
    }
}
