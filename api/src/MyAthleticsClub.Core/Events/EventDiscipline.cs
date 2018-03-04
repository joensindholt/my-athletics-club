using System.Collections.Generic;

namespace MyAthleticsClub.Core.Events
{
    public class EventDiscipline
    {
        public string AgeGroup { get; set; }
        public List<Discipline> Disciplines { get; set; }

        public EventDiscipline()
        {
            Disciplines = new List<Discipline>();
        }

        public EventDiscipline(string ageGroup, List<Discipline> disciplines)
        {
            AgeGroup = ageGroup;
            Disciplines = disciplines;
        }
    }
}
