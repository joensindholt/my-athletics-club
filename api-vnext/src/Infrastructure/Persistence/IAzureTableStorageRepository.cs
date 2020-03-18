using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Infrastructure.Persistence
{
    public interface IAzureTableStorageRepository
    {
        Task Add(object entity);

        Task Update(object entity);

        Task Delete(object entity);

        Task<IEnumerable<object>> GetAll(Type entityType);
    }
}