using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Members
{
    public interface IMemberRepository
    {
        Task<IEnumerable<Member>> GetAllAsync(string organizationId);

        Task<IEnumerable<Member>> GetActiveMembersAsync(string organizationId);

        Task<IEnumerable<Member>> GetTerminatedMembersAsync(string organizationId);

        Task<IEnumerable<Member>> GetActiveMembersByStartDateAsync(DateTime date);

        Task<Member> GetAsync(string organizationId, string id);

        Task CreateAsync(Member member);

        Task UpdateAsync(Member member);

        Task DeleteAsync(Member member);

        Task<bool> ExistsAsync(string organizationId, string id);

        Task<int> CountAllAsync(string organizationId);

        Task ChargeMembersAsync(string organizationId);

        Task<string> GetNextMemberNumberAsync(string organizationId);

        Task SetTerminationDate(string organizationId, string memberId, DateTime terminationDate);

        Task<MemberStatistics> GetStatistics(string organizationId, DateTime date);

        Task<int> GetAvailableFamilyMembershipNumberAsync(string organizationId);
    }
}
