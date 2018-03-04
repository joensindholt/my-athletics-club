using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Api.ViewModels;
using MyAthleticsClub.Core.Members;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Models.Requests;

namespace MyAthleticsClub.Api.Members
{
    public class MemberController : Controller
    {
        private readonly IMemberService _memberService;

        public MemberController(IMemberService memberService)
        {
            _memberService = memberService;
        }

        [HttpGet("api/members")]
        [ProducesResponseType(typeof(IEnumerable<Member>), 200)]
        public async Task<IActionResult> GetAllMembers()
        {
            var members = await _memberService.GetActiveMembersAsync("gik");
            return Ok(new { items = members });
        }

        [HttpGet("api/members/terminated")]
        [ProducesResponseType(typeof(IEnumerable<Member>), 200)]
        public async Task<IActionResult> GetTerminatedMembers()
        {
            var members = await _memberService.GetTerminatedMembersAsync("gik");
            return Ok(new { items = members });
        }

        [HttpGet("api/members/{id}")]
        [ProducesResponseType(typeof(Member), 200)]
        public async Task<IActionResult> GetMember([FromRoute]string id)
        {
            var member = await _memberService.GetAsync("gik", id);
            return Ok(member);
        }

        [HttpPost("api/members")]
        [ProducesResponseType(typeof(Member), 200)]
        public async Task<IActionResult> CreateMember([FromBody]Member member)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            member.OrganizationId = "gik";
            await _memberService.CreateAsync("gik", member);
            return Ok(member);
        }

        [HttpPut("api/members/{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> UpdateMember([FromRoute]Guid id, [FromBody]Member member)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            member.OrganizationId = "gik";
            await _memberService.UpdateAsync(member);
            return Ok();
        }

        [HttpPost("api/members/charge-all")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> ChargeAllMembers()
        {
            await _memberService.ChargeMembersAsync("gik");
            return Ok();
        }

        [HttpPost("api/members/terminate")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> TerminateMembership([FromBody]TerminateMembershipRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _memberService.TerminateMembershipAsync("gik", request);
            return Ok();
        }

        [HttpGet("api/members/statistics")]
        [ProducesResponseType(typeof(MemberStatistics), 200)]
        public async Task<IActionResult> Statistics([FromQuery]DateTime date)
        {
            var statistics = await _memberService.GetStatistics("gik", date);
            return Ok(statistics);
        }

        [HttpGet("api/members/available-family-membership-number")]
        [ProducesResponseType(typeof(AvailableFamilyMembershipNumberResponse), 200)]
        public async Task<IActionResult> GetAvailableFamilyMembershipNumber()
        {
            var number = await _memberService.GetAvailableFamilyMembershipNumberAsync("gik");
            return Ok(new AvailableFamilyMembershipNumberResponse(number));
        }
    }
}
