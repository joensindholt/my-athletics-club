using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendTemplateEmailAsync(string to, string templateId, object data, CancellationToken cancellationToken);

        Task SendTemplateEmailAsync(IEnumerable<string> to, string templateId, object data, CancellationToken cancellationToken);
    }
}
