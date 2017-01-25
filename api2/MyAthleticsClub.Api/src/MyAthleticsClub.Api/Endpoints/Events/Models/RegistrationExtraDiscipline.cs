namespace MyAthleticsClub.Api.Events
{
    public class RegistrationExtraDiscipline : RegistrationDiscipline
    {
        public string AgeClass { get; set; }

        public RegistrationExtraDiscipline()
        {
        }

        public RegistrationExtraDiscipline(
            string id,
            string name,
            string personalRecord,
            string ageClass)
            : base(id, name, personalRecord)
        {
            AgeClass = ageClass;
        }
    }
}