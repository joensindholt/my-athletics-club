using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Core.Members;
using MyAthleticsClub.Core.Members.AddMember;
using MyAthleticsClub.Core.Members.GetMember;
using MyAthleticsClub.Core.Members.GetWelcomeMessageTemplates;
using MyAthleticsClub.Core.Subscriptions;

namespace MyAthleticsClub.Api.Members
{
    public class MemberController : Controller
    {
        private readonly IMemberService _memberService;
        private readonly ISubscriptionService _subscriptionService;
        private readonly GetWelcomeMessageTemplatesService _getWelcomeMessageTemplatesService;

        public MemberController(
            IMemberService memberService,
            ISubscriptionService subscriptionService,
            GetWelcomeMessageTemplatesService getWelcomeMessageTemplatesService)
        {
            _memberService = memberService;
            _subscriptionService = subscriptionService;
            _getWelcomeMessageTemplatesService = getWelcomeMessageTemplatesService;
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
        [ProducesResponseType(typeof(GetMemberResponse), 200)]
        public async Task<IActionResult> GetMember([FromRoute] string id)
        {
            var response = await _memberService.GetAsync("gik", id);
            return Ok(response);
        }

        [HttpPost("api/members")]
        [ProducesResponseType(typeof(AddMemberResponse), 200)]
        public async Task<IActionResult> CreateMember(
            [FromBody] AddMemberRequest request,
            CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // This check should be in the request but since it uses the member model directly it can't.
            // Reason is that Phone is only required in the "create" scenario but not in the "update" scenario and
            // the Member model is unfortunately reused in both places.
            // You shall not use models in request objects!!!
            //if (string.IsNullOrWhiteSpace(request.Member.Phone))
            //{
            //    return BadRequest("Phone must be specified");
            //}

            request.Member.OrganizationId = "gik";

            var response = await _memberService.CreateAsync(request, cancellationToken);

            return Ok(response);
        }

        [HttpPut("api/members/{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> UpdateMember([FromRoute] Guid id, [FromBody] Member member)
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

            // new implementation
            await _subscriptionService.ChargeAllSubscriptionsAsync();

            return Ok();
        }

        [HttpPost("api/members/terminate")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> TerminateMembership([FromBody] TerminateMembershipRequest request)
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
        public async Task<IActionResult> Statistics([FromQuery] DateTime date)
        {
            var statistics = await _memberService.GetStatistics("gik", date);
            return Ok(statistics);
        }

        /// Get member statistics for CFR (Centrale Forenings Register) either as json or csv
        [HttpGet("api/members/statistics/cfr.{format}"), FormatFilter]
        [ProducesResponseType(typeof(MemberStatistics), 200)]
        public async Task<IActionResult> StatisticsCfr([FromQuery] int year, string format)
        {
            var statistics = await _memberService.GetStatisticsCfr("gik", year);
            return Ok(statistics.Statistics);
        }

        [HttpGet("api/members/available-family-membership-number")]
        [ProducesResponseType(typeof(AvailableFamilyMembershipNumberResponse), 200)]
        public async Task<IActionResult> GetAvailableFamilyMembershipNumber()
        {
            var number = await _memberService.GetAvailableFamilyMembershipNumberAsync("gik");
            return Ok(new AvailableFamilyMembershipNumberResponse(number));
        }

        [HttpGet("api/members/welcome-message-templates")]
        [ProducesResponseType(typeof(GetWelcomeMessageTemplatesResponse), 200)]
        public async Task<IActionResult> GetWelcomeMessageTemplates()
        {
            var templates = await _getWelcomeMessageTemplatesService.GetWelcomeMessageTemplates();
            return Ok(templates);
        }
    }
}
