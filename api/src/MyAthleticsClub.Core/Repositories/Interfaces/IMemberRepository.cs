using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface IMemberRepository
    {
        Task<IEnumerable<Member>> GetAllByPartitionKey(string organizationId);

        Task<Member> GetAsync(string organizationId, string id);

        Task CreateAsync(Member member);

        Task UpdateAsync(Member member);

        Task DeleteAsync(string organizationId, string id);

        Task<bool> ExistsAsync(string organizationId, string id);

        Task<int> CountAllAsync(string organizationId);

        Task ChargeAllAsync(string organizationId);

        Task<string> GetNextMemberNumberAsync(string organizationId);

        Task SetTerminationDate(string organizationId, string memberId, DateTime terminationDate);

        Task<MemberStatistics> GetStatistics(string organizationId, DateTime date);
    }
}
