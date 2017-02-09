using System.Collections.Generic;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IEventRegistrationsExcelService
    {
        byte[] GetEventRegistrationsAsXlsx(IEnumerable<Registration> registrations);
    }
}