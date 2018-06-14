using Microsoft.WindowsAzure.Storage.Table;
using System;

namespace MyAthleticsClub.Core.Events
{
    public class EventEntity : TableEntity
    {
        public string Title { get; set; }

        public DateTime Date { get; set; }

        public DateTime? EndDate { get; set; }

        public string Address { get; set; }

        public string DisciplinesJson { get; set; }

        public string Link { get; set; }

        public DateTime? RegistrationPeriodStartDate { get; set; }

        public DateTime? RegistrationPeriodEndDate { get; set; }

        public string Info { get; set; }

        public int? MaxDisciplinesAllowed { get; set; }

        public bool IsDeleted { get; set; }

        public EventEntity()
        {
            ETag = "*";
        }

        public EventEntity(
            string id,
            string organizationId,
            string title,
            DateTime date,
            DateTime? endDate,
            string address,
            string disciplineJson,
            string link,
            DateTime? registrationPeriodStartDate,
            DateTime? registrationPeriodEndDate,
            string info,
            int? maxDisciplinesAllowed,
            bool isDeleted) : base(organizationId, id)
        {
            Title = title;
            Date = date;
            EndDate = endDate;
            Address = address;
            DisciplinesJson = disciplineJson;
            Link = link;
            RegistrationPeriodStartDate = registrationPeriodStartDate;
            RegistrationPeriodEndDate = registrationPeriodEndDate;
            Info = info;
            MaxDisciplinesAllowed = maxDisciplinesAllowed;
            IsDeleted = isDeleted;

            ETag = "*";
        }
    }
}
