using System.Collections.Generic;
using System.Linq;

namespace MyAthleticsClub.Core.MarsEvents
{
    public class MarsEventResultLine
    {
        public string Name { get; set; }
        public string AgeGroup { get; set; }
        public string Discipline { get; set; }
        public int? Position { get; set; }
        public string Value { get; set; }

        public static IEnumerable<MarsEventResultLine> FromEvent(MarsEvent @event)
        {
            // Get all results containing position. This will filter out DNS results and results where,
            // for some reason, results have not been entered
            var marsResults = @event.Results.Where(e => e.Value != "DNS" && !string.IsNullOrWhiteSpace(e.Value.Trim()));

            // When disciplines has multiple rounds a participant have multiple results for the same discipline if
            // he/she made it to the final. To handle this we order disciplines with "Final" first and then group
            // by participant and discipline and take the best position
            // Note that first we "sanitize" the discipline by removing "Final" and "Round x" from the discipline
            var results =
                marsResults
                    .OrderBy(r => !r.Event.Contains("Final"))
                    .Select(r => new MarsEventResultLine
                    {
                        Name = r.Name,
                        AgeGroup = r.Group,
                        Discipline = r.GetSanitizedEvent(),
                        Position = r.GetPosition(),
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

            return results;
        }
    }
}
