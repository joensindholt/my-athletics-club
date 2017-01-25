using System.Collections.Generic;

namespace MyAthleticsClub.Api.Events
{
    public interface IEventRegistrationsExcelService
    {
        byte[] GetEventRegistrationsAsXlsx(IEnumerable<Registration> registrations);
    }
}