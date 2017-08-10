using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Commands;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Utilities;

namespace MyAthleticsClub.Api.Controllers
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
            var members = await _memberService.GetAllAsync("gik");
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

        [HttpDelete("api/members/{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> DeleteMember([FromRoute]string id)
        {
            await _memberService.DeleteAsync("gik", id);
            return Ok();
        }

        [HttpPost("api/members/charge-all")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> ChargeAllMembers()
        {
            await _memberService.ChargeAllAsync("gik");
            return Ok();
        }

        [HttpPost("api/members/terminate")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> TerminateMembership([FromBody]TerminateMembershipCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _memberService.TerminateMembershipAsync("gik", command);
            return Ok();
        }
    }
}
