using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Services
{
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _memberRepository;

        public MemberService(IMemberRepository memberRepository)
        {
            _memberRepository = memberRepository;
        }

        public async Task<IEnumerable<Member>> GetAllAsync(string organizationId)
        {
            return await _memberRepository.GetAllByPartitionKey(organizationId);
        }

        public async Task<Member> GetAsync(string organizationId, string id)
        {
            return await _memberRepository.GetAsync(organizationId, id);
        }

        public async Task CreateAsync(Member member)
        {
            await _memberRepository.CreateAsync(member);
        }

        public async Task UpdateAsync(Member member)
        {
            await _memberRepository.UpdateAsync(member);
        }

        public async Task DeleteAsync(string organizationId, string id)
        {
            await _memberRepository.DeleteAsync(organizationId, id);
        }
    }
}
