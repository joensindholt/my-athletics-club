using System.Net.Http;
using System.Threading.Tasks;
using ApiKeepAlive;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.Logging;

[assembly: WebJobsStartup(typeof(Startup))]

namespace ApiKeepAlive
{
    public class KeepAlive
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<KeepAlive> _logger;

        public KeepAlive(IHttpClientFactory httpClientFactory, ILogger<KeepAlive> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [FunctionName("KeepAlive")]
        public async Task Run([TimerTrigger("0 */15 * * * *")]TimerInfo myTimer)
        {
            _logger.LogInformation($"Invoking API health endpoint");
            
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync("https://myathleticsclubapi.azurewebsites.net/api/health");
            
            _logger.LogInformation("Got response: {@StatusCode}", response.StatusCode);
        }
    }
}
