using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Services.Email
{
    public interface IEmailTemplateProvider
    {
        Task<IEmailTemplate> GetTemplateAsync(string id, CancellationToken cancellationToken);
    }
}
