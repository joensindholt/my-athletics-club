using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.StorageEntities;

namespace MyAthleticsClub.Core.Repositories
{
    public class MemberRepository : AzureStorageRepository<Member, MemberEntity>, IMemberRepository
    {
        public MemberRepository(CloudStorageAccount account)
            : base(account, "members")
        {
        }

        /// <summary>
        /// Gets all members that are not terminated
        /// </summary>
        /// <returns>The list of members</returns>
        public async override Task<IEnumerable<Member>> GetAllAsync()
        {
            return
                (await base.GetAllAsync())
                    .Where(m => MemberIsActive(m));
        }

        public async override Task<IEnumerable<Member>> GetAllByPartitionKey(string partitionKey)
        {
            return 
                (await base.GetAllByPartitionKey(partitionKey))
                    .Where(m => MemberIsActive(m));
        }

        public async Task<int> CountAllAsync(string organizationId)
        {
            var all = await base.GetAllByPartitionKey(organizationId);
            return all.Count();
        }

        public async Task ChargeAllAsync(string organizationId)
        {
            var all = await base.GetAllByPartitionKey(organizationId);
            foreach(var member in all)
            {
                member.HasOutstandingMembershipPayment = true;
                await UpdateAsync(member);
            }
        }

        protected override Member ConvertEntityToObject(MemberEntity entity)
        {
            var member = new Member(
                entity.PartitionKey,
                entity.RowKey,
                entity.Number,
                entity.Name,
                entity.Email,
                entity.Email2,
                entity.FamilyMembershipNumber,
                entity.BirthDate != null ? (DateTime?)DateTime.Parse(entity.BirthDate, CultureInfo.InvariantCulture) 
                                         : null,
                entity.HasOutstandingMembershipPayment,
                entity.TerminationDate,
                entity.StartDate);

            return member;
        }

        protected override MemberEntity ConvertObjectToEntity(Member member)
        {
            var entity = new MemberEntity(
                member.OrganizationId,
                member.Id,
                member.Number,
                member.Name,
                member.Email,
                member.Email2,
                member.FamilyMembershipNumber,
                member.BirthDate,
                member.HasOutstandingMembershipPayment,
                member.TerminationDate,
                member.StartDate);

            return entity;
        }

        public async Task<string> GetNextMemberNumberAsync(string organizationId)
        {
            // We always start a new year at the year number plus 347 just to have an offset
            var yearStartNumber = 347;

            // Find the two last digits of the current year. I.e. 17, 18, 19, 20...
            var currentYear2Digit = DateTime.Now.Year.ToString().Substring(2, 2);

            // Get all members
            var members = await GetAllAsync();

            // Find the members with member numbers from this year
            var currentYearMembers = members.Where(m => m.Number.StartsWith(currentYear2Digit));

            if (!currentYearMembers.Any())
            {
                // If it's the first member this year then use the year start number
                return currentYear2Digit + yearStartNumber.ToString();
            }
            else
            {
                // ...else get the maximum member number for this year and add one
                var nextNumber = currentYearMembers.Max(m => int.Parse(m.Number)) + 1;
                return nextNumber.ToString();
            }
        }

        public async Task SetTerminationDate(string organizationId, string memberId, DateTime terminationDate)
        {
            var member = await GetAsync(organizationId, memberId);
            member.TerminationDate = terminationDate;
            await UpdateAsync(member);
        }

        private bool MemberIsActive(Member member)
        {
            return member.TerminationDate == null || member.TerminationDate > DateTime.Today;
        }
    }
}
