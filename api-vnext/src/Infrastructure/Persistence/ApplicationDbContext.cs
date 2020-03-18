using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Domain.Entities;
using System.Linq;

namespace MyAthleticsClub.Api.Infrastructure.Persistence
{

    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        private readonly IAzureTableStorageRepository _azureRepository;

        public ApplicationDbContext(DbContextOptions options, IAzureTableStorageRepository azureRepository)
          : base(options)
        {
            _azureRepository = azureRepository;
        }

        public DbSet<Member> Members { get; set; } = null!;

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in this.ChangeTracker.Entries())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        await _azureRepository.Add(entry.Entity);
                        break;
                    case EntityState.Modified:
                        await _azureRepository.Update(entry.Entity);
                        break;
                    case EntityState.Deleted:
                        await _azureRepository.Delete(entry.Entity);
                        break;
                    default:
                        break;
                }
            }

            // Do nothing for now
            return 0;
        }

        public async Task Initialize()
        {
            var members = (await _azureRepository.GetAll(typeof(Member))).Cast<Member>();
            this.Members = new ApplicationDbSet<Member>(members);
        }
    }
}