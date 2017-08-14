using System;
using System.ComponentModel.DataAnnotations;
using MyAthleticsClub.Core.Repositories.Interfaces;

namespace MyAthleticsClub.Core.Models
{
    public enum Team { Miniholdet, Mellemholdet, Storeholdet }

    public enum Gender { Male, Female }

    public class Member : IEntityObject
    {
        public string OrganizationId { get; set; }

        public string Id { get; set; }

        public string Number { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        public string Email2 { get; set; }

        public string FamilyMembershipNumber { get; set; }

        public DateTime? BirthDate { get; set; }

        public bool HasOutstandingMembershipPayment { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? TerminationDate { get; set; }

        public Team? Team { get; set; }

        public Gender? Gender { get; set; }

        public Member()
        {
        }

        public Member(
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
        {
            OrganizationId = organizationId;
            Id = id;
            Number = number;
            Name = name;
            Email = email;
            Email2 = email2;
            FamilyMembershipNumber = familyMembershipNumber;
            BirthDate = birthDate;
            HasOutstandingMembershipPayment = hasOutstandingMembershipPayment;
            TerminationDate = terminationDate;
            StartDate = startDate;
            Team = team;
            Gender = gender;
        }

        public string GetPartitionKey()
        {
            return OrganizationId;
        }

        public string GetRowKey()
        {
            return Id;
        }
    }
}