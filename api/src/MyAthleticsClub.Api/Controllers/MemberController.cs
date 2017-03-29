using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("api/members/{slug}")]
        [ProducesResponseType(typeof(Member), 200)]
        public async Task<IActionResult> GetMember([FromRoute]string slug)
        {
            var member = await _memberService.GetAsync("gik", slug);
            return Ok(member);
        }

        [HttpPost("api/members")]
        [ProducesResponseType(typeof(Member), 200)]
        public async Task<IActionResult> CreateMember([FromBody]Member member)
        {
            member.OrganizationId = "gik";

            await _memberService.CreateAsync(member);

            return Ok(member);
        }

        [HttpPut("api/members/{slug}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> UpdateMember([FromRoute]string slug, [FromBody]Member member)
        {
            member.OrganizationId = "gik";
            await _memberService.UpdateAsync(member);
            return Ok();
        }

        [HttpDelete("api/members/{slug}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> DeleteMember([FromRoute]string slug)
        {
            await _memberService.DeleteAsync("gik", slug);
            return Ok();
        }
    }
}
