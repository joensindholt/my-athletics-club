using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyAthleticsClub.Api.Application.Features.Members.GetMembers;

namespace MyAthleticsClub.Api.WebApi
{
    [Route("members")]
    public class MembersController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<GetMembersResponse>> Get(CancellationToken cancellationToken)
        {
            return await Mediator.Send(new GetMembersQuery(), cancellationToken);
        }
    }
}
