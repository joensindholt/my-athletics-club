using System;
using System.Collections.Generic;
using System.Linq;

namespace MyAthleticsClub.Core.MarsEvents
{
    public class Result : IEntityObject
    {
        public MarsResultInfo LastEvent { get; set; }

        public Medals MedalsThisYear { get; set; }

        public static Result FromMarsEvents(IEnumerable<MarsEvent> events)
        {
            var result = new Result();

            // We only look at the events where we actualy participated
            events = events.Where(e => e.Results != null);

            // Resolve last event info
            var lastEvent =
                events
                    .Where(e => e.GetDate().Date < DateTime.Today)
                    .OrderByDescending(e => e.GetDate())
                    .FirstOrDefault();

            if (lastEvent != null)
            {
                var results = MarsEventResultLine.FromEvent(lastEvent);

                result.LastEvent = new MarsResultInfo
                {
                    Title = lastEvent.GetTitle(),
                    Date = lastEvent.GetDate(),
                    Results = results
                };
            }

            // Resolve totals for the year
            var eventsThisYear = events.Where(e => e.GetDate().Year == DateTime.Now.Year);
            result.MedalsThisYear = new Medals
            {
                Gold = eventsThisYear.Sum(e => e.Results.Count(r => r.IsFinal() && r.Position == "1")),
                Silver = eventsThisYear.Sum(e => e.Results.Count(r => r.IsFinal() && r.Position == "2")),
                Bronce = eventsThisYear.Sum(e => e.Results.Count(r => r.IsFinal() && r.Position == "3"))
            };

            return result;
        }

        public string GetPartitionKey()
        {
            return "gik";
        }

        public string GetRowKey()
        {
            return "1";
        }

        public class Medals
        {
            public int Gold { get; set; }
            public int Silver { get; set; }
            public int Bronce { get; set; }
        }
    }
}
