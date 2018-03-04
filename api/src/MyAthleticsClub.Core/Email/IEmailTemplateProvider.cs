using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Email
{
    public interface IEmailTemplateProvider
    {
        Task<IEmailTemplate> GetTemplateAsync(string id, CancellationToken cancellationToken);
    }
}
