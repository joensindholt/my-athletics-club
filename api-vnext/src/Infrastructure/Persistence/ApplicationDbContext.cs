using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Domain.Entities;

namespace MyAthleticsClub.Api.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Member> Members { get; set; }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            // Do nothing for now
            return 0;
        }

        public override int SaveChanges()
        {
            // Do nothing for now
            return 0;
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            // Do nothing for now
            return Task.FromResult(0);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var changedEntries = this.ChangeTracker.Entries();

            foreach (var entry in changedEntries)
            {
                // TODO: Implement Azure Table Storage 
                // var persister = GetPersisterForType(entry.Metadata.ClrType);

                // switch (entry.State)
                // {
                //     case EntityState.Added:
                //         persister.Add(entry.Member);
                //         break;
                //     case EntityState.Deleted:
                //         persister.Delete(entry.Member);
                //         break;
                //     case EntityState.Modified:
                //         persister.Update(entry.Member);
                //         break;
                //     default:
                //         break;
                // }
            }

            // Do nothing for now
            return Task.FromResult(0);
        }
    }
}