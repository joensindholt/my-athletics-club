using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MyAthleticsClub.Core.Services.Interfaces;
using Newtonsoft.Json;

namespace MyAthleticsClub.Core.Services
{
    public class SlackService : ISlackService
    {
        private readonly Uri _webhookUrl;
        private readonly HttpClient _httpClient = new HttpClient();

        public SlackService(IConfigurationRoot configuration)
        {
            _webhookUrl = new Uri(configuration["SLACK_WEBHOOK_URL"]);
        }

        public async Task SendMessageAsync(
            string message,
            string channel = null,
            string username = null,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            var payload = new
            {
                text = message,
                channel,
                username,
            };
            var serializedPayload = JsonConvert.SerializeObject(payload);
            var response =
                await _httpClient.PostAsync(
                    _webhookUrl,
                    new StringContent(
                        serializedPayload,
                        Encoding.UTF8,
                        "application/json"), cancellationToken);

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Got unexpected status code '{response.StatusCode}' when posting message to slack. Expected status code 200(OK)");
            }
        }
    }
}