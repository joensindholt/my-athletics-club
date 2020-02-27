using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Api.Domain.Entities;

namespace MyAthleticsClub.Api.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        IQueryable<Member> Members { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}