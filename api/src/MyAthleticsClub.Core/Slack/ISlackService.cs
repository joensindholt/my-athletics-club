using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Slack
{
    public interface ISlackService
    {
        Task SendMessageAsync(object message, CancellationToken cancellationToken = default(CancellationToken));
    }
}
