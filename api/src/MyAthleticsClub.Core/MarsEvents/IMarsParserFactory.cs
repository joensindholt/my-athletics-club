using System.Collections.Generic;

namespace MyAthleticsClub.Core.MarsEvents
{
    public interface IMarsParserFactory
    {
        IEnumerable<IMarsParser> GetParsers();
    }
}
