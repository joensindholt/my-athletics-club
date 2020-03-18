using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MyAthleticsClub.Api.Infrastructure.Persistence
{
    public class AzureTableStorageDbSet<T> : DbSet<T> where T : class
    {
        private IEnumerable<T> _entities;

        public AzureTableStorageDbSet(IEnumerable<T> entities)
        {
            _entities = entities;
        }


    }
}