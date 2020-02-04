using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.Logging;

[assembly: WebJobsStartup(typeof(MyAthleticsClub.Server.Startup))]

namespace MyAthleticsClub.Server.Functions
{
    public class KeepAlive
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public KeepAlive(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [FunctionName("KeepAlive")]
        public async Task Run([TimerTrigger("0 */15 * * * *")]TimerInfo myTimer, ILogger logger)
        {
            logger.LogInformation($"Invoking API health endpoint");

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync("https://myathleticsclubapi.azurewebsites.net/api/health");

            logger.LogInformation($"Got {response.StatusCode} response");
        }
    }
}
