using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using CsQuery;
using MyAthleticsClub.Core.Shared;

namespace MyAthleticsClub.Core.MarsEvents
{
    public class MarsNetParser : IMarsParser
    {
        private readonly IHttpClientAdapter _httpClient;

        private const string BASE_URL = "http://d.mars-net.dk";

        public string Name => "MarsNet";

        public MarsNetParser(IHttpClientAdapter httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<MarsEvent>> ParseEventsAsync(string stopAtMeetId, CancellationToken cancellationToken)
        {
            var liveboardHtml = await GetUrlAsync("/Liveboard", cancellationToken);
            var results = await ParseLiveboardHtmlAsync(liveboardHtml, stopAtMeetId, cancellationToken);
            return results;
        }

        private async Task<IEnumerable<MarsEvent>> ParseLiveboardHtmlAsync(string liveboardHtml, string stopAtMeetId, CancellationToken cancellationToken)
        {
            var events = new List<MarsEvent>();

            CQ liveboard = liveboardHtml;

            var eventElements = liveboard[".table a[href]"].Elements;

            foreach (var eventElement in eventElements)
            {
                var meetId = Regex.Match(eventElement.GetAttribute("href"), "\\/Liveboard\\/Events\\?meetId=(.*)").Groups[1].Value;

                if (stopAtMeetId != null && meetId == stopAtMeetId)
                {
                    break;
                }

                var teamEventLink = $"/Liveboard/Teams?meetId={meetId}";
                var results = await ParseTeamsHtmlAsync(teamEventLink, cancellationToken);

                var marsEvent = new MarsEvent(
                    meetId: meetId,
                    title: eventElement.TextContent,
                    link: eventElement.GetAttribute("href"),
                    results: results,
                    parser: Name
                );

                events.Add(marsEvent);
            }

            return events;
        }

        private async Task<IEnumerable<MarsEvent.Result>> ParseTeamsHtmlAsync(string link, CancellationToken cancellationToken)
        {
            var html = await GetUrlAsync(link, cancellationToken);

            CQ teams = html;

            var teamElements = teams[".table a[href]"];

            var organizationTeamElement = teamElements.FirstOrDefault(e => e.TextContent.ToLower().Contains("gentofte"));

            if (organizationTeamElement == null)
            {
                return null;
            }

            var teamResultsLink = organizationTeamElement.GetAttribute("href");

            var teamResultHtml = await GetUrlAsync(teamResultsLink, cancellationToken);

            CQ teamResult = teamResultHtml;

            var resultRowElements = teamResult[".table tr"].Skip(1);

            var results = new List<MarsEvent.Result>();
            foreach (var resultRowElement in resultRowElements)
            {
                var resultCellElements = resultRowElement.ChildElements.ToList();
                results.Add(new MarsEvent.Result
                {
                    Value = resultCellElements[3].TextContent,
                    Position = resultCellElements[4].TextContent,
                    Name = resultCellElements[5].TextContent,
                    YearOfBirth = resultCellElements[6].TextContent,
                    QualifyingTime = resultCellElements[7].TextContent,
                    Event = resultCellElements[8].TextContent,
                    Group = resultCellElements[9].TextContent,
                    DayAndTime = resultCellElements[10].TextContent
                });
            }

            return results;
        }

        private async Task<string> GetUrlAsync(string relativeUrl, CancellationToken cancellationToken)
        {
            var url = $"{BASE_URL}{relativeUrl}";
            var response = await _httpClient.GetAsync(url, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Got unexpected status code '{response.StatusCode}' getting '{url}'");
            }

            var html = await response.Content.ReadAsStringAsync();

            return html;
        }
    }
}
