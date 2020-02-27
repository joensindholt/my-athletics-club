using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Domain.Entities;

namespace MyAthleticsClub.Api.Application.Features.Members.GetMembers
{
    public class GetMembersQuery : IRequest<GetMembersResponse>
    {
    }

    public class GetMembersResponse
    {
        public IEnumerable<MemberDto> Members { get; set; }

        public class MemberDto
        {
            public string Name { get; set; }
        }
    }

    public class GetMembersHandler : IRequestHandler<GetMembersQuery, GetMembersResponse>
    {
        private readonly IApplicationDbContext _context;

        public GetMembersHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GetMembersResponse> Handle(GetMembersQuery request, CancellationToken cancellationToken)
        {
            var members =
                _context.Members
                    .Where(Member.IsActive)
                    .Select(m => new GetMembersResponse.MemberDto
                    {
                        Name = m.Name
                    })
                    .ToList();

            return await Task.FromResult(new GetMembersResponse
            {
                Members = members
            });
        }
    }
}