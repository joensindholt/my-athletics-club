using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Slug;

namespace MyAthleticsClub.Core.Services
{
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly ISlugGenerator _slugGenerator;

        public MemberService(IMemberRepository memberRepository, ISlugGenerator slugGenerator)
        {
            _memberRepository = memberRepository;
            _slugGenerator = slugGenerator;
        }

        public async Task<IEnumerable<Member>> GetAllAsync(string organizationId)
        {
            return await _memberRepository.GetAllByPartitionKey(organizationId);
        }

        public async Task<Member> GetAsync(string organizationId, string slug)
        {
            return await _memberRepository.GetAsync(organizationId, slug);
        }

        public async Task CreateAsync(Member member)
        {
            var slugKey = 0;
            do
            {
                member.Slug = _slugGenerator.GenerateSlug(member.Name, slugKey);
                slugKey++;
            }
            while (await _memberRepository.ExistsAsync(member.OrganizationId, member.Slug));

            await _memberRepository.CreateAsync(member);
        }

        public async Task UpdateAsync(Member member)
        {
            await _memberRepository.UpdateAsync(member);
        }

        public async Task DeleteAsync(string organizationId, string slug)
        {
            await _memberRepository.DeleteAsync(organizationId, slug);
        }
    }
}
