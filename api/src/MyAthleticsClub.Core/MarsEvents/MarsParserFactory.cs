using System.Collections.Generic;
using MyAthleticsClub.Core.Shared;

namespace MyAthleticsClub.Core.MarsEvents
{
    public class MarsParserFactory : IMarsParserFactory
    {
        private readonly IHttpClientAdapter _httpClient;

        public MarsParserFactory(IHttpClientAdapter httpClient)
        {
            _httpClient = httpClient;
        }

        public IEnumerable<IMarsParser> GetParsers()
        {
            return new List<IMarsParser>
            {
                new MarsNetParser(_httpClient),
                new IMarsDKParser(_httpClient)
            };
        }
    }
}
