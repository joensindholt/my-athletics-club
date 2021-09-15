using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Core.Email;
using MyAthleticsClub.Core.Shared.Exceptions;

namespace MyAthleticsClub.Core.Enrollments
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
                throw new BadRequestException("Enrolling via this api is not yet possible");
            }

            await SendAdminEmailAsync(enrollment, cancellationToken);
            await SendConfirmationEmailAsync(enrollment, cancellationToken);
        }

        private async Task SendAdminEmailAsync(EnrollmentRequest enrollment, CancellationToken cancellationToken)
        {
            await _emailService.SendTemplateEmailAsync(
                to: _options.AdminEmail,
                templateId: _emailService.Templates.EnrollmentAdminNotification,
                data: enrollment,
                cancellationToken: cancellationToken);
        }

        private async Task SendConfirmationEmailAsync(EnrollmentRequest enrollment, CancellationToken cancellationToken)
        {
            await _emailService.SendTemplateEmailAsync(
                to: enrollment.Email,
                templateId: _emailService.Templates.EnrollmentReceipt,
                data: enrollment,
                cancellationToken: cancellationToken);
        }
    }

    public class EnrollmentOptions
    {
        public bool Enabled { get; set; } = true;

        public string AdminEmail { get; set; } = "indmeld@gentofte-atletik.dk";
    }
}
