using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Application.Features.Members.DataTansferObjects;
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
                    .Select(m => new
                    {
                        m.Id,
                        m.Name
                    })
                    .ToList()
                    .Select(m => new MemberDto(id: m.Id, name: m.Name))
                    .ToList();

            return await Task.FromResult(new GetMembersResponse(members));
        }
    }
}