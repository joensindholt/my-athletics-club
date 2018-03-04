using System.Collections.Generic;

namespace MyAthleticsClub.Core.Events
{
    public interface IEventRegistrationsExcelService
    {
        byte[] GetEventRegistrationsAsXlsx(IEnumerable<Registration> registrations);
    }
}
