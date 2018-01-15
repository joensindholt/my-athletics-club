using System;
using System.Collections.Generic;
using System.Linq;
using MyAthleticsClub.Core.Repositories.Interfaces;

namespace MyAthleticsClub.Core.Models
{
    public class Result : IEntityObject
    {
        public Event LastEvent { get; set; }

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
                // Get all results containing position. This will filter out DNS results and results where,
                // for some reason, results have not been entered
                var marsResults = lastEvent.Results.Where(e => e.Value != "DNS" && !string.IsNullOrWhiteSpace(e.Value.Trim()));

                // When disciplines has multiple rounds a participant have multiple results for the same discipline if
                // he/she made it to the final. To handle this we order disciplines with "Final" first and then group by participant and discipline and take the best position
                // Note that first we "sanitize" the discipline by removing "Final" and "Round x" from the discipline
                var results =
                    marsResults
                        .OrderBy(r => !r.Event.Contains("Final"))
                        .Select(r => new EventResult
                        {
                            Name = r.Name,
                            AgeGroup = r.Group,
                            Discipline = r.GetSanitizedEvent(),
                            Position = !string.IsNullOrWhiteSpace(r.Position) ? (int?)int.Parse(r.Position) : null,
                            Value = r.Value
                        });

                results = results
                    .GroupBy(r => r.Name + r.Discipline)
                    .Select(g => g.First());

                // We order the results by position so that the best positions are shown first
                results =
                    results
                        .OrderBy(r => r.Position == null)
                        .ThenBy(r => r.Position)
                        .ThenBy(r => r.Name);

                result.LastEvent = new Event
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

        public class Event
        {
            public string Title { get; set; }
            public DateTime Date { get; set; }
            public IEnumerable<EventResult> Results { get; set; }
        }

        public class EventResult
        {
            public string Name { get; set; }
            public string AgeGroup { get; set; }
            public string Discipline { get; set; }
            public int? Position { get; set; }
            public string Value { get; set; }
        }

        public class Medals
        {
            public int Gold { get; set; }
            public int Silver { get; set; }
            public int Bronce { get; set; }
        }
    }
}
