using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IMemberService
    {
        Task<IEnumerable<Member>> GetAllAsync(string organizationId);

        Task<Member> GetAsync(string organizationId, string id);

        Task CreateAsync(string organizationId, Member member);

        Task UpdateAsync(Member member);

        Task DeleteAsync(string organizationId, string id);
    }
}
