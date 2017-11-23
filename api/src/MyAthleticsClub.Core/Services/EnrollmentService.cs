using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Core.Exceptions;
using MyAthleticsClub.Core.Models.Requests;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly EnrollmentOptions _options;
        private readonly IEmailService _emailService;

        public EnrollmentService(
            IOptions<EnrollmentOptions> options,
            IEmailService emailService
            )
        {
            _options = options.Value;
            _emailService = emailService;
        }

        public async Task EnrollAsync(EnrollmentRequest enrollment, CancellationToken cancellationToken)
        {
            if (!_options.Enabled)
            {
                throw new BadRequestException("Enrolling via this api is not yet available");
            }

            await SendAdminEmailAsync(enrollment, cancellationToken);
            await SendConfirmationEmailAsync(enrollment, cancellationToken);
        }

        private async Task SendAdminEmailAsync(EnrollmentRequest enrollment, CancellationToken cancellationToken)
        {
            var to = "gik.atletik@gmail.com";

            var subject = "Ny indmeldelse";

            var body =
                $"<div>En person har indsendt en indmeldelse via hjemmesiden</div>" +
                $"<div>&nbsp;</div>" +
                $"<div><strong>Email:</strong></div>" +
                $"<div>{enrollment.Email}</div>" +
                $"<div>&nbsp;</div>" +
                $"<div><strong>Personer der skal indmeldes:</strong></div>" +
                string.Join("", enrollment.Members.Select(m => $"<div>Navn: {m.Name}, Fødselsdato: {m.BirthDate}</div>")) +
                $"<div>&nbsp;</div>" +
                $"<div><strong>Kommentarer:</strong></div>" +
                $"<div style=\"white-space: pre;\">{enrollment.Comments}</div>";

            await _emailService.SendEmailAsync(to, subject, body, cancellationToken);
        }

        private async Task SendConfirmationEmailAsync(EnrollmentRequest enrollment, CancellationToken cancellationToken)
        {
            var to = enrollment.Email;

            var subject = "Tak for din indmeldelse";

            var body = $"Vis skal have noget andet tekst i den her mail";

            await _emailService.SendEmailAsync(to, subject, body, cancellationToken);
        }
    }

    public class EnrollmentOptions
    {
        public bool Enabled { get; set; } = true;
    }
}
