using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Domain.Entities;

namespace MyAthleticsClub.Api.Infrastructure.Persistence
{
    public class ApplicationDbContext : IApplicationDbContext
    {
        public IQueryable<Member> Members => new List<Member>
        {
            new Member { Name = "John Doe"},
            new Member { Name = "Jane Doe"}
        }
        .AsQueryable();

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            return await Task.FromResult(0);
        }
    }
}