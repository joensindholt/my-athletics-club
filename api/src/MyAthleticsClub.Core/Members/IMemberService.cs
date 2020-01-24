using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Members
{
    public interface IMemberService
    {
        Task<IEnumerable<Member>> GetActiveMembersAsync(string organizationId);

        Task<IEnumerable<Member>> GetTerminatedMembersAsync(string organizationId);

        Task<Member> GetAsync(string organizationId, string id);

        Task CreateAsync(string organizationId, Member member);

        Task UpdateAsync(Member member);

        Task ChargeMembersAsync(string organizationId);

        Task TerminateMembershipAsync(string organizationId, TerminateMembershipRequest command);

        Task<MemberStatistics> GetStatistics(string organizationId, DateTime date);

        Task<MemberStatistics> GetStatisticsCfr(string organizationId, int year);

        Task<int> GetAvailableFamilyMembershipNumberAsync(string organizationId);
    }
}
