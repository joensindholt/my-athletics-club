using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.SysEvents
{
    public interface ISysEventService
    {
        Task<IEnumerable<SysEvent>> GetAllAsync();

        Task CreateAsync(SysEvent _event);
    }
}