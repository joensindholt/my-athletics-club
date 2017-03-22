using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;
using MyAthleticsClub.Core.Utilities;

namespace MyAthleticsClub.Api.Controllers
{
    public class MemberController : Controller
    {
        private readonly IMemberService _memberService;
        private readonly IIdGenerator _idGenerator;

        public MemberController(IMemberService memberService, IIdGenerator idGenerator)
        {
            _memberService = memberService;
            _idGenerator = idGenerator;
        }

        [HttpGet("api/members")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<Member>), 200)]
        public async Task<IActionResult> GetAllMembers()
        {
            var members = await _memberService.GetAllAsync("gik");
            return Ok(members);
        }

        [HttpGet("api/members/{id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(Member), 200)]
        public async Task<IActionResult> GetMember(string id)
        {
            var member = await _memberService.GetAsync("gik", id);
            return Ok(member);
        }

        [HttpPost("api/members")]
        [ProducesResponseType(typeof(Member), 200)]
        public async Task<IActionResult> CreateMember([FromBody]Member member)
        {
            member.Id = _idGenerator.GenerateId();
            member.OrganizationId = "gik";

            await _memberService.CreateAsync(member);

            return Ok(member);
        }

        [HttpPut("api/members/{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> UpdateMember(string id, [FromBody]Member member)
        {
            member.OrganizationId = "gik";
            await _memberService.UpdateAsync(member);
            return Ok();
        }

        [HttpDelete("api/members/{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> DeleteMember(string id)
        {
            await _memberService.DeleteAsync("gik", id);
            return Ok();
        }
    }
}
