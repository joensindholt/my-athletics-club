using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Events
{
    public interface IRegistrationService
    {
        Task<Registration> AddRegistrationAsync(string eventId, Registration registration, CancellationToken cancellationToken);

        Task<IEnumerable<Registration>> GetEventRegistrationsAsync(string eventId);

        Task<byte[]> GetEventRegistrationsAsXlsxAsync(string eventId);

        Task SendRegistrationEmailReceiptAsync(Registration registration, Event _event, CancellationToken cancellationToken);
    }
}
