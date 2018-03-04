namespace MyAthleticsClub.Core.Events
{
    public class Discipline
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public Discipline()
        {
        }

        public Discipline(string id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
