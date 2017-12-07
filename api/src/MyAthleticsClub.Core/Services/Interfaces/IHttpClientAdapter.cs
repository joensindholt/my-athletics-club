using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IHttpClientAdapter
    {
        Task<HttpResponseMessage> GetAsync(string url, CancellationToken cancellationToken);
    }
}
