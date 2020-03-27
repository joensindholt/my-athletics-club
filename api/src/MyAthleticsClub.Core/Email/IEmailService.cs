using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Email
{
    public interface IEmailService
    {
        EmailTemplates Templates { get; }

        Task SendTemplateEmailAsync(string to, string templateId, object data, CancellationToken cancellationToken);

        Task SendTemplateEmailAsync(IEnumerable<string> to, string templateId, object data, CancellationToken cancellationToken);

        Task SendMarkdownEmail(string to, string subject, string template, object data, CancellationToken cancellation);
    }
}
