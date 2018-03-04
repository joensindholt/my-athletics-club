using System.Text;

namespace MyAthleticsClub.Core.Events
{
    public class RegistrationSlackMessageBuilder
    {
        public object BuildSimpleMessage(Event _event, Registration registration)
        {
            return new
            {
                text = $"*Tilmelding modtaget*\nNavn: {registration.Name}\nStævne: {_event.Title}\nAldersklasse: {registration.AgeClass}\nEmail: {registration.Email}\nDiscipliner:\n{GetSlackMessageDisciplineList(registration, true)}"
            };
        }

        public object BuildAdvancedMessage(Event _event, Registration registration)
        {
            return new
            {
                text = "Tilmelding modtaget",
                attachments = new object[]
                {
                    new
                    {
                        color = "good",
                        fields = new object[]
                        {
                            new { title = "Stævne", value = _event.Title },
                            new { title = "Deltager", value = registration.Name, @short = true },
                            new { title = "Email", value = registration.Email, @short = true },
                            new { title = "Aldersklasse", value = registration.AgeClass, @short = true },
                            new { title = "Discipliner", value = GetSlackMessageDisciplineList(registration, false) }
                        }
                    }
                }
            };
        }

        private string GetSlackMessageDisciplineList(Registration registration, bool listStyleBullet)
        {
            var sb = new StringBuilder();

            int i = 0;
            if (registration.Disciplines != null)
            {
                foreach (var discipline in registration.Disciplines)
                {
                    if (listStyleBullet)
                    {
                        sb.Append("- ");
                    }

                    sb.Append(discipline.Name);

                    if (i != registration.Disciplines.Count - 1)
                    {
                        sb.Append("\n");
                    }

                    i++;
                }
            }

            if (registration.ExtraDisciplines != null && registration.ExtraDisciplines.Count > 0)
            {
                if (registration.Disciplines.Count > 0)
                {
                    sb.Append("\n");
                }

                i = 0;
                foreach (var discipline in registration.ExtraDisciplines)
                {
                    if (listStyleBullet)
                    {
                        sb.Append("- ");
                    }

                    sb.Append($"{discipline.Name} ({discipline.AgeClass})");

                    if (i != registration.Disciplines.Count - 1)
                    {
                        sb.Append("\n");
                    }

                    i++;
                }
            }

            return sb.ToString();
        }
    }
}
