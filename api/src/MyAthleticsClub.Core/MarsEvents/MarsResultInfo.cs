using System;
using System.Collections.Generic;

namespace MyAthleticsClub.Core.MarsEvents
{
    public class MarsResultInfo
    {
        public string Title { get; set; }

        public DateTime Date { get; set; }

        public IEnumerable<MarsEventResultLine> Results { get; set; }

        public static MarsResultInfo FromMarsEvent(MarsEvent @event)
        {
            return new MarsResultInfo
            {
                Title = @event.GetTitle(),
                Date = @event.GetDate(),
                Results = MarsEventResultLine.FromEvent(@event)
            };
        }
    }
}
