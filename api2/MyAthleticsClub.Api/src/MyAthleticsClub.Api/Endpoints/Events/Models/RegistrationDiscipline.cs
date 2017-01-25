namespace MyAthleticsClub.Api.Events
{
    public class RegistrationDiscipline
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string PersonalRecord { get; set; }

        public RegistrationDiscipline()
        {
        }

        public RegistrationDiscipline(
            string id,
            string name,
            string personalRecord)
            : this()
        {
            Id = id;
            Name = name;
            PersonalRecord = personalRecord;
        }
    }
}