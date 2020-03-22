using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Api.Application.Features.Members.CreateMember;
using MyAthleticsClub.Api.Application.Features.Members.GetMembers;
using MyAthleticsClub.Api.Application.Features.Members.UpdateMember;

namespace MyAthleticsClub.Api.WebApi
{
    [Route("members")]
    public class MemberController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<GetMembersResponse>> GetMembers(
            CancellationToken cancellationToken)
            => await Mediator.Send(new GetMembersRequest(), cancellationToken);

        [HttpPost]
        public async Task<ActionResult<CreateMemberResponse>> CreateMember(
            CreateMemberRequest request,
            CancellationToken cancellationToken)
            => await Mediator.Send(request, cancellationToken);

        [HttpPut("{id}")]
        public async Task<ActionResult<UpdateMemberResponse>> UpdateMember(
            UpdateMemberRequest request,
            CancellationToken cancellationToken)
            => await Mediator.Send(request, cancellationToken);
    }
}
