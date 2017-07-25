﻿using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface IMemberRepository
    {
        Task<IEnumerable<Member>> GetAllByPartitionKey(string organizationId);

        Task<Member> GetAsync(string organizationId, string slug);

        Task CreateAsync(Member member);

        Task UpdateAsync(Member member);

        Task DeleteAsync(string organizationId, string slug);

        Task<bool> ExistsAsync(string organizationId, string slug);

        Task<int> CountAllAsync(string organizationId);
    }
}
