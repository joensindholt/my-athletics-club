using System;

namespace MyAthleticsClub.Core.Members
{
    public class TerminateMembershipRequest
    {
        public string MemberId { get; set; }

        public DateTime TerminationDate { get; set; }
    }
}
