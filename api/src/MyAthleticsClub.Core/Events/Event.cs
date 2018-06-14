using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyAthleticsClub.Core.Events
{
    public class Event : IEntityObject
    {
        public string Id { get; set; }
        public string OrganizationId { get; set; }

        [Required]
        public string Title { get; set; }

        public DateTime Date { get; set; }
        public DateTime? EndDate { get; set; }
        public string Address { get; set; }
        public string Link { get; set; }
        public List<EventDiscipline> Disciplines { get; set; }
        public DateTime? RegistrationPeriodStartDate { get; set; }
        public DateTime? RegistrationPeriodEndDate { get; set; }
        public string Info { get; set; }
        public bool IsOldEvent { get; set; }
        public int MaxDisciplinesAllowed { get; set; }
        public bool IsDeleted { get; set; }

        public Event()
        {
            Disciplines = new List<EventDiscipline>();
        }

        public Event(
            string id,
            string organizationId,
            string title,
            DateTime date,
            DateTime? endDate,
            string address,
            string link,
            List<EventDiscipline> disciplines,
            DateTime? registrationPeriodStartDate,
            DateTime? registrationPeriodEndDate,
            string info,
            int maxDisciplinesAllowed,
            bool isDeleted) : this()
        {
            Id = id;
            OrganizationId = organizationId;
            Title = title;
            Date = date;
            EndDate = endDate;
            Address = address;
            Link = link;
            Disciplines = disciplines ?? new List<EventDiscipline>();
            RegistrationPeriodStartDate = registrationPeriodStartDate;
            RegistrationPeriodEndDate = registrationPeriodEndDate;
            Info = info;
            IsOldEvent = date.Date < DateTime.Today.AddDays(-7);
            MaxDisciplinesAllowed = maxDisciplinesAllowed;
            IsDeleted = isDeleted;
        }

        public string GetPartitionKey()
        {
            return OrganizationId;
        }

        public string GetRowKey()
        {
            return Id;
        }
    }
}
