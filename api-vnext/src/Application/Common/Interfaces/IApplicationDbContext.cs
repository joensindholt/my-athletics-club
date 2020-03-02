using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyAthleticsClub.Api.Domain.Entities;

namespace MyAthleticsClub.Api.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Member> Members { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}