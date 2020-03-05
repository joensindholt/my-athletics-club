using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Members.AddMember;
using MyAthleticsClub.Core.Members.GetMember;

namespace MyAthleticsClub.Core.Members
{
    public interface IMemberService
    {
        Task<IEnumerable<Member>> GetActiveMembersAsync(string organizationId);

        Task<IEnumerable<Member>> GetTerminatedMembersAsync(string organizationId);

        Task<GetMemberResponse> GetAsync(string organizationId, string id);

        Task<AddMemberResponse> CreateAsync(AddMemberRequest request, CancellationToken cancellationToken);

        Task UpdateAsync(Member member);

        Task ChargeMembersAsync(string organizationId);

        Task TerminateMembershipAsync(string organizationId, TerminateMembershipRequest command);

        Task<MemberStatistics> GetStatistics(string organizationId, DateTime date);

        Task<MemberStatistics> GetStatisticsCfr(string organizationId, int year);

        Task<int> GetAvailableFamilyMembershipNumberAsync(string organizationId);

        Task NotifyFourteenDayMembers();
    }
}
