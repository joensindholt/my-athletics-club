using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Slug;

namespace MyAthleticsClub.Core.Members
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

        public async Task<IEnumerable<Member>> GetActiveMembersAsync(string organizationId)
        {
            return await _memberRepository.GetActiveMembersAsync(organizationId);
        }

        public async Task<IEnumerable<Member>> GetTerminatedMembersAsync(string organizationId)
        {
            return await _memberRepository.GetTerminatedMembersAsync(organizationId);
        }

        public async Task<Member> GetAsync(string organizationId, string id)
        {
            return await _memberRepository.GetAsync(organizationId, id);
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

        private async Task<string> GetNextMemberNumberAsync(string organizationId)
        {
            return await _memberRepository.GetNextMemberNumberAsync(organizationId);
        }

        public async Task ChargeMembersAsync(string organizationId)
        {
            await _memberRepository.ChargeMembersAsync(organizationId);
        }

        public async Task TerminateMembershipAsync(string organizationId, TerminateMembershipRequest command)
        {
            await _memberRepository.SetTerminationDate(organizationId, command.MemberId, command.TerminationDate);
        }

        public async Task<MemberStatistics> GetStatistics(string organizationId, DateTime date)
        {
            return await _memberRepository.GetStatistics(organizationId, date);
        }

        public async Task<int> GetAvailableFamilyMembershipNumberAsync(string organizationId)
        {
            return await _memberRepository.GetAvailableFamilyMembershipNumberAsync(organizationId);
        }
    }
}
