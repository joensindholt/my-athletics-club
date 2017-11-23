using System;

namespace MyAthleticsClub.Core.Models.Requests
{
    public class TerminateMembershipRequest
    {
        public string MemberId { get; set; }

        public DateTime TerminationDate { get; set; }
    }
}
