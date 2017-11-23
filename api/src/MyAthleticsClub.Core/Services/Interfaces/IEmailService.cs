using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, CancellationToken cancellationToken);

        Task SendEmailAsync(IEnumerable<string> to, string subject, string body, CancellationToken cancellationToken);
    }
}
