using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.StorageEntities
{
    public class MemberEntity : TableEntity
    {
        public string Number { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Email2 { get; set; }

        public string FamilyMembershipNumber { get; set; }

        public string BirthDate { get; set; }

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
            DateTime birthDate)
            : base(organizationId, id)
        {
            Number = number;
            Name = name;
            Email = email;
            Email2 = email2;
            FamilyMembershipNumber = familyMembershipNumber;
            BirthDate = birthDate.ToString("yyyy-MM-dd");

            ETag = "*";
        }
    }
}