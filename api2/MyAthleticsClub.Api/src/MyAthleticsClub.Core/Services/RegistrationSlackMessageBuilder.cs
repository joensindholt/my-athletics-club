using System.Text;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Core.Services
{
    public class RegistrationSlackMessageBuilder
    {
        public string BuildSimpleMessage(Event _event, Registration registration)
        {
            return $"*Tilmelding modtaget*\nNavn: {registration.Name}\nStævne: {_event.Title}\nAldersklasse {registration.AgeClass}\nEmail: {registration.Email}\nDiscipliner:\n{GetSlackMessageDisciplineList(registration)}";
        }

        public string BuildMessage(Event _event, Registration registration)
        {
            return $"{{\"text\":\"Tilmelding modtaget\",\"attachments\":[{{\"color\":\"good\",\"fields\":[{{\"title\":\"Stævne\",\"value\":\"{_event.Title}\"}},{{\"title\":\"Deltager\",\"value\":\"{registration.Name}\",\"short\":true}},{{\"title\":\"Email\",\"value\":\"{registration.Email}\",\"short\":true}},{{\"title\":\"Aldersklasse\",\"value\":\"{registration.AgeClass}\",\"short\":true}},{{\"title\":\"Discipliner\",\"value\":\"{GetSlackMessageDisciplineList(registration)}\"}}]}}]}}";
        }

        private string GetSlackMessageDisciplineList(Registration registration)
        {
            var sb = new StringBuilder();

            int i = 0;
            foreach (var discipline in registration.Disciplines)
            {
                sb.Append($"- {discipline.Name}");

                if (i != registration.Disciplines.Count - 1)
                {
                    sb.Append("\n");
                }

                i++;
            }

            i = 0;
            foreach (var discipline in registration.ExtraDisciplines)
            {
                sb.Append($"- {discipline.Name} ({discipline.AgeClass})");

                if (i != registration.Disciplines.Count - 1)
                {
                    sb.Append("\n");
                }

                i++;
            }

            return sb.ToString();
        }
    }
}
