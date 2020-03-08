using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Domain.Entities;

namespace MyAthleticsClub.Api.Application.Features.Members.GetMembers
{
    public class GetMembersHandler : IRequestHandler<GetMembersRequest, GetMembersResponse>
    {
        private readonly IApplicationDbContext _context;

        public GetMembersHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GetMembersResponse> Handle(GetMembersRequest request, CancellationToken cancellationToken)
        {
            var members =
                _context.Members
                    .Where(Member.IsActiveExpr)
                    .Select(m => new GetMembersResponse.Member
                    {
                        Name = m.Name
                    })
                    .ToList();

            return await Task.FromResult(new GetMembersResponse(members));
        }
    }
}