using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Email;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IEmailService
    {
        EmailTemplates Templates { get; }

        Task SendTemplateEmailAsync(string to, string templateId, object data, CancellationToken cancellationToken);

        Task SendTemplateEmailAsync(IEnumerable<string> to, string templateId, object data, CancellationToken cancellationToken);
    }
}
