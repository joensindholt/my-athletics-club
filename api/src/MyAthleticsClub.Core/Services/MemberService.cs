using System;
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

        public async Task CreateAsync(string organizationId, Member member)
        {
            member.Id = Guid.NewGuid().ToString();
            member.Number = await GetNextMemberNumberAsync(organizationId);
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

        private async Task<string> GetNextMemberNumberAsync(string organizationId)
        {
            var members = await _memberRepository.CountAllAsync(organizationId);
            var currentYear2Digit = DateTime.Now.Year.ToString().Substring(2, 2);
            var startNumber = int.Parse(currentYear2Digit + "347");
            var nextNumber = startNumber + members;
            return nextNumber.ToString();
        }
    }
}