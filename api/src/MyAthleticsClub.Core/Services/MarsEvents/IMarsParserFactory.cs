using System.Collections.Generic;

namespace MyAthleticsClub.Core.Services.MarsEvents
{
    public interface IMarsParserFactory
    {
        IEnumerable<IMarsParser> GetParsers();
    }
}
