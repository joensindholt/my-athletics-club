using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Mocks.HttpClientResponses;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Mocks
{
    public class MockedHttpClientAdapter : IHttpClientAdapter
    {
        public async Task<HttpResponseMessage> GetAsync(string url, CancellationToken cancellationToken)
        {
            var knownUrls = new List<(Regex regex, string response)>
            {
                (new Regex("http:\\/\\/d\\.mars-net\\.dk\\/Liveboard$"), MarsLiveboardResponse.Value),
                (new Regex("http:\\/\\/d\\.mars-net\\.dk\\/Liveboard\\/Teams\\?meetId=.*"), MarsTeamsResponse.Value),
                (new Regex("http:\\/\\/d\\.mars-net\\.dk\\/Liveboard\\/Team\\?meetId=.*&teamId=.*&dayNo=0&sortBy=0"), MarsTeamResponse.Value)
            };

            if (knownUrls.Any(k => k.regex.IsMatch(url)))
            {
                var response = knownUrls.First(k => k.regex.IsMatch(url)).response;
                return await Task.FromResult(new HttpResponseMessage { StatusCode = HttpStatusCode.OK, Content = new StringContent(response) });
            }

            return new HttpResponseMessage { StatusCode = HttpStatusCode.NotFound };
        }
    }
}
