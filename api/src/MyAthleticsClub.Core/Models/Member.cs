using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MyAthleticsClub.Core.Repositories.Interfaces;

namespace MyAthleticsClub.Core.Models
{
    public class Member : IEntityObject
    {
        public string Id { get; set; }

        public string OrganizationId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Slug { get; set; }

        public MemberAddress Address { get; set; }

        public List<string> Emails { get; set; }

        public List<string> Phones { get; set; }

        public MemberGender Gender { get; set; }

        public DateTime BirthDate { get; set; }

        public MemberTeam Team { get; set; }

        public Member()
        {
        }

        public Member(
            string id,
            string organizationId,
            string name)
        {
            Id = id;
            OrganizationId = organizationId;
            Name = name;
        }

        public string GetPartitionKey()
        {
            return OrganizationId;
        }

        public string GetRowKey()
        {
            return Id;
        }

        public enum MemberGender { Male, Female };

        public enum MemberTeam { Mini, Middle, Elders }

        public class MemberAddress
        {
            public string Line1 { get; set; }

            public string PostalCode { get; set; }

            public string City { get; set; }
        }
    }
}
