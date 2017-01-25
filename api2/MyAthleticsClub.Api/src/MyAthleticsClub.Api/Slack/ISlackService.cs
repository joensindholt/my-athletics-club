using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Slack
{
    public interface ISlackService
    {
        Task SendMessageAsync(
           string message,
           string channel = null,
           string username = null,
           CancellationToken cancellationToken = default(CancellationToken));
    }
}