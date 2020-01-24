using System;
using System.Collections.Generic;
using System.Linq;

namespace MyAthleticsClub.Core.Members
{
    public class MemberStatistics
    {
        public MemberStatistics()
        {
            Members = new List<MemberStatisticsMember>();      
            Statistics = new List<MemberStatisticsEntry>();      
        }

        public MemberStatistics(IEnumerable<Member> members) : this()
        {
            Members = members.Select(m => new MemberStatisticsMember(m));            
        }

        public List<MemberStatisticsEntry> Statistics { get; }

        public IEnumerable<MemberStatisticsMember> Members { get; }

        public void AddEntry(MemberStatisticsEntry entry)
        {
            Statistics.Add(entry);
        }
    }

    public class MemberStatisticsMember
    {
        public MemberStatisticsMember(Member member)
        {
            Name = member.Name;
            StartDate = member.StartDate;
            TerminationDate = member.TerminationDate;
            BirthDate = member.BirthDate;
            Age = member.GetAge(DateTime.Now);
        }

        public string Name { get; }

        public DateTime? StartDate { get; }

        public DateTime? TerminationDate { get; }

        public DateTime? BirthDate { get; }

        public int Age { get; }
    }

    public class MemberStatisticsEntry
    {
        public int Age { get; private set; }

        public int Males { get; }

        public int Females { get; }

        public MemberStatisticsEntry(int age, int females, int males)
        {
            Age = age;
            Males = males;
            Females = females;
        }
    }
}
