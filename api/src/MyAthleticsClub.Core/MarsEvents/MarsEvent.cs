using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;

namespace MyAthleticsClub.Core.MarsEvents
{
    public class MarsEvent : IEntityObject
    {
        public string Title { get; set; }

        public string Link { get; set; }

        public IEnumerable<Result> Results { get; set; }

        public string MeetId { get; set; }

        /// <summary>
        /// The parser with which the event was found (MarsNet, IMars, ...)
        /// </summary>
        public string Parser { get; set; }

        public MarsEvent(
            string meetId,
            string title,
            string link,
            IEnumerable<Result> results,
            string parser)
        {
            MeetId = meetId;
            Title = title;
            Link = link;
            Results = results;
            Parser = parser;
        }

        public string GetTitle()
        {
            var parts = Title.Split('•');
            return parts[0].Trim();
        }

        public DateTime GetDate()
        {
            var parts = Title.Split('•');
            var datePart = parts[1];

            // The date part may be something like "2017 Aug 19 - Aug 20", so we get the first part of the date part
            var firstDatePart = Regex.Matches(datePart, "[^-]*")[0].Value;
            var date = DateTime.ParseExact(firstDatePart.Trim(), "yyyy MMM dd", CultureInfo.GetCultureInfo("en-US"));
            return date;
        }

        public string GetPartitionKey()
        {
            return "gik";
        }

        public string GetRowKey()
        {
            return MeetId;
        }

        public class Result
        {
            public string Value { get; set; }

            public string Position { get; set; }

            public string Name { get; set; }

            public string YearOfBirth { get; set; }

            public string QualifyingTime { get; set; }

            public string Event { get; set; }

            public string Group { get; set; }

            public string DayAndTime { get; set; }

            public bool IsFinal()
            {
                if (Event.Contains("Indledende"))
                {
                    return false;
                }

                if (Event.Contains("Round"))
                {
                    return false;
                }

                return true;
            }

            /// <summary>
            /// Events might be '80 meter hæk - indledende'. In that case we discard the '- indledende' part
            /// </summary>
            /// <returns>The the sanitized event name</returns>
            public string GetSanitizedEvent()
            {
                return Event.Split('-')[0].Trim();
            }

            public int? GetPosition()
            {
                if (!IsFinal())
                {
                    return null;
                }

                return !string.IsNullOrWhiteSpace(Position) ? (int?)int.Parse(Position) : null;
            }
        }
    }
}
