using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Shared
{
    public class HttpClientAdapter : IHttpClientAdapter
    {
        private readonly HttpClient _httpClient;

        public HttpClientAdapter(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public Task<HttpResponseMessage> GetAsync(string url, CancellationToken cancellationToken)
        {
            return _httpClient.GetAsync(url, cancellationToken);
        }
    }
}
