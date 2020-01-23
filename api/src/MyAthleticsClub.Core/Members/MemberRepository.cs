using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;

namespace MyAthleticsClub.Core.Members
{
    public class MemberRepository : AzureStorageRepository<Member, MemberEntity>, IMemberRepository
    {
        public MemberRepository(CloudStorageAccount account)
            : base(account, "members")
        {
        }

        public async Task<IEnumerable<Member>> GetAllAsync(string organizationId)
        {
            return await base.GetAllByPartitionKeyInternalAsync(organizationId);
        }

        public async Task<IEnumerable<Member>> GetActiveMembersAsync(string organizationId)
        {
            return
                (await base.GetAllByPartitionKeyInternalAsync(organizationId))
                    .Where(m => MemberIsActive(m));
        }

        public async Task<IEnumerable<Member>> GetTerminatedMembersAsync(string organizationId)
        {
            return
                (await base.GetAllByPartitionKeyInternalAsync(organizationId))
                    .Where(m => !MemberIsActive(m));
        }

        public async Task<int> CountAllAsync(string organizationId)
        {
            var all = await base.GetAllByPartitionKeyInternalAsync(organizationId);
            return all.Count();
        }

        public async Task ChargeMembersAsync(string organizationId)
        {
            var allMembers = await base.GetAllByPartitionKeyInternalAsync(organizationId);

            var membersToCharge = allMembers.Where(m => MemberIsActive(m));

            foreach (var member in membersToCharge)
            {
                member.HasOutstandingMembershipPayment = true;
                await UpdateInternalAsync(member);
            }
        }

        public async Task<string> GetNextMemberNumberAsync(string organizationId)
        {
            // We always start a new year at the year number plus 347 just to have an offset
            var yearStartNumber = 347;

            // Find the two last digits of the current year. I.e. 17, 18, 19, 20...
            var currentYear2Digit = DateTime.Now.Year.ToString().Substring(2, 2);

            // Get all members
            var members = await GetAllByPartitionKeyInternalAsync(organizationId);

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

        public async Task<int> GetAvailableFamilyMembershipNumberAsync(string organizationId)
        {
            var allMembers = await GetAllByPartitionKeyInternalAsync(organizationId);

            var familyMembers =
                allMembers
                  .Where(m => m.FamilyMembershipNumber != null)
                  .Where(m => int.TryParse(m.FamilyMembershipNumber, out int result));

            if (!familyMembers.Any())
            {
                return 1;
            }

            var maxFamilyMembershipNumber = familyMembers.Max(m => int.Parse(m.FamilyMembershipNumber));

            return maxFamilyMembershipNumber + 1;
        }

        public async Task SetTerminationDate(string organizationId, string memberId, DateTime terminationDate)
        {
            var member = await GetInternalAsync(organizationId, memberId);
            member.TerminationDate = terminationDate;
            await UpdateInternalAsync(member);
        }

        public async Task<MemberStatistics> GetStatistics(string organizationId, DateTime date)
        {
            var allMembers = await base.GetAllByPartitionKeyInternalAsync(organizationId);
            var membersOnDate =
                allMembers
                    .Where(m => m.TerminationDate == null || m.TerminationDate.Value.Date > date.Date);

            var membersByAge =
                membersOnDate
                    .Where(m => m.BirthDate.HasValue)
                    .GroupBy(m => m.GetAge(date))
                    .ToDictionary(
                        i => i.Key,
                        i => i
                    );

            var minAge = membersByAge.Min(m => m.Key);
            var maxAge = membersByAge.Max(m => m.Key);

            var statistics = new MemberStatistics();
            for (var age = minAge; age <= maxAge; age++)
            {
                int females = 0;
                int males = 0;

                if (membersByAge.ContainsKey(age))
                {
                    females = membersByAge[age].Count(m => m.Gender == Gender.Female);
                    males = membersByAge[age].Count(m => m.Gender == Gender.Male);
                }

                statistics.Add(new MemberStatisticsEntry(age, females, males));
            }

            return statistics;
        }

        public Task<Member> GetAsync(string organizationId, string id)
        {
            return GetInternalAsync(organizationId, id);
        }

        public Task CreateAsync(Member member)
        {
            return CreateInternalAsync(member);
        }

        public Task UpdateAsync(Member member)
        {
            return UpdateInternalAsync(member);
        }

        public Task<bool> ExistsAsync(string organizationId, string id)
        {
            return ExistsInternalAsync(organizationId, id);
        }

        private bool MemberIsActive(Member member)
        {
            return member.TerminationDate == null || member.TerminationDate > DateTime.Today;
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
                entity.StartDate,
                (Team?)entity.Team,
                (Gender?)entity.Gender);

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
                member.StartDate,
                member.Team,
                member.Gender);

            return entity;
        }
    }
}
