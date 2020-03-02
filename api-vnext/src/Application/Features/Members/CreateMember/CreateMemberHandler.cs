using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Domain.Entities;

namespace MyAthleticsClub.Api.Application.Features.Members.CreateMember
{
    public class CreateMemberHandler : IRequestHandler<CreateMemberRequest, CreateMemberResponse>
    {
        private readonly IApplicationDbContext _context;

        public CreateMemberHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CreateMemberResponse> Handle(CreateMemberRequest request, CancellationToken cancellationToken)
        {
            var member = new Member(name: request.Name);

            _context.Members.Add(member);

            await _context.SaveChangesAsync(cancellationToken);

            return await Task.FromResult(new CreateMemberResponse(member.Id));
        }
    }
}
