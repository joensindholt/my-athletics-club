using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MyAthleticsClub.Api.Application.Common.Exceptions;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Application.Features.Members.DataTansferObjects;

namespace MyAthleticsClub.Api.Application.Features.Members.UpdateMember
{
    public class UpdateMemberHandler : IRequestHandler<UpdateMemberRequest, UpdateMemberResponse>
    {
        private readonly IApplicationDbContext _context;

        public UpdateMemberHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UpdateMemberResponse> Handle(UpdateMemberRequest request, CancellationToken cancellationToken)
        {
            var member = await _context.Members.FindAsync(request.Id);

            if (member == null)
            {
                throw new NotFoundException();
            }

            if (member.Name != request.Name)
            {
                member.UpdateName(request.Name);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return await Task.FromResult(new UpdateMemberResponse(new MemberDto(
                id: member.Id,
                name: member.Name
            )));
        }
    }
}
