using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.Members
{
    public class MemberEntity : TableEntity
    {
        public string Number { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Email2 { get; set; }

        public string FamilyMembershipNumber { get; set; }

        public string BirthDate { get; set; }

        public bool HasOutstandingMembershipPayment { get; set; }

        public DateTime? TerminationDate { get; set; }

        public DateTime? StartDate { get; set; }

        public int? Team { get; set; }

        public int? Gender { get; set; }

        public MemberEntity()
        {
            ETag = "*";
        }

        public MemberEntity(
            string organizationId,
            string id,
            string number,
            string name,
            string email,
            string email2,
            string familyMembershipNumber,
            DateTime? birthDate,
            bool hasOutstandingMembershipPayment,
            DateTime? terminationDate,
            DateTime? startDate,
            Team? team,
            Gender? gender)
            : base(organizationId, id)
        {
            Number = number;
            Name = name;
            Email = email;
            Email2 = email2;
            FamilyMembershipNumber = familyMembershipNumber;
            BirthDate = birthDate.HasValue ? birthDate.Value.ToString("yyyy-MM-dd") : null;
            HasOutstandingMembershipPayment = hasOutstandingMembershipPayment;
            TerminationDate = terminationDate;
            StartDate = startDate;
            Team = (int?)team;
            Gender = (int?)gender;

            ETag = "*";
        }
    }
}
