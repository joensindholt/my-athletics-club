using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace MyAthleticsClub.Core.Slack
{
    public class SlackService : ISlackService
    {
        private readonly Uri _webhookUrl;
        private readonly HttpClient _httpClient = new HttpClient();

        public SlackService(IOptions<SlackOptions> slackOptions)
        {
            _webhookUrl = new Uri(slackOptions.Value.WebHookUrl);
        }

        public async Task SendMessageAsync(object message, CancellationToken cancellationToken = default(CancellationToken))
        {
            var serializedMessage = JsonConvert.SerializeObject(message);

            var response =
                await _httpClient.PostAsync(
                    _webhookUrl,
                    new StringContent(
                        serializedMessage,
                        Encoding.UTF8,
                        "application/json"), cancellationToken);

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Got unexpected status code '{response.StatusCode}' when posting message to slack. Expected status code 200(OK)");
            }
        }
    }
}
