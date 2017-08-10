using System;

namespace MyAthleticsClub.Core.Commands
{
    public class TerminateMembershipCommand
    {
        public string MemberId { get; set; }

        public DateTime TerminationDate { get; set; }
    }
}