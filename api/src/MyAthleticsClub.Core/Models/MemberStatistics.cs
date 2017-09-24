using System.Collections.Generic;

namespace MyAthleticsClub.Core.Models
{
    public class MemberStatistics : List<MemberStatisticsEntry>
    {
    }

    public class MemberStatisticsEntry
    {
        public int Age { get; private set; }

        public MemberStatisticsGenders Genders { get; private set; }

        public MemberStatisticsEntry(int age, int females, int males)
        {
            Age = age;
            Genders = new MemberStatisticsGenders(females, males);
        }
    }

    public class MemberStatisticsGenders
    {
        public int Females { get; private set; }

        public int Males { get; private set; }

        public MemberStatisticsGenders(int females, int males)
        {
            Females = females;
            Males = males;
        }
    }
}
