using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Core.Email;
using MyAthleticsClub.Core.Enrollments;
using NSubstitute;
using Xunit;

namespace MyAthleticsClub.UnitTests.Core.Services
{
    public class EnrollmentServiceTests
    {
        [Fact]
        public async Task WhenAPersonEnrolls_AnEmailIsSentToGik()
        {
            // Arrange
            var enrollment = new EnrollmentRequest
            {
                Email = "test@test.dk",
                Name = "John",
                BirthDate = "13-02-2005",
                Phone = "123323322",
                Comments = "These are my comments\nwith a newline and all"
            };

            var emailServiceMock = Substitute.For<IEmailService>();
            emailServiceMock.Templates.Returns(new EmailTemplates { EnrollmentAdminNotification = "123" });

            var enrollmentOptions = Substitute.For<IOptions<EnrollmentOptions>>();
            enrollmentOptions.Value.Returns(new EnrollmentOptions());

            var enrollmentService = new EnrollmentService(enrollmentOptions, emailServiceMock);

            // Act
            await enrollmentService.EnrollAsync(enrollment, CancellationToken.None);

            // Assert
            await emailServiceMock.Received(1).SendTemplateEmailAsync(
                to: "indmeld@gentofte-atletik.dk",
                templateId: "123",
                data: enrollment,
                cancellationToken: CancellationToken.None);
        }

        [Fact]
        public async Task WhenAPersonEnrolls_AnEmailReceiptIsSentToTheEnrollersEmailAddress()
        {
            // Arrange
            var enrollment = new EnrollmentRequest
            {
                Email = "test@test.dk",
                Name = "John",
                BirthDate = "13-02-2005",
                Phone = "123342232",
                Comments = "These are my comments\nwith a newline and all"
            };

            var emailServiceMock = Substitute.For<IEmailService>();
            emailServiceMock.Templates.Returns(new EmailTemplates { EnrollmentReceipt = "456" });

            var enrollmentOptions = Substitute.For<IOptions<EnrollmentOptions>>();
            enrollmentOptions.Value.Returns(new EnrollmentOptions());

            var enrollmentService = new EnrollmentService(enrollmentOptions, emailServiceMock);

            // Act
            await enrollmentService.EnrollAsync(enrollment, CancellationToken.None);

            // Assert
            await emailServiceMock.Received(1).SendTemplateEmailAsync(
                to: enrollment.Email,
                templateId: "456",
                data: enrollment,
                cancellationToken: CancellationToken.None);
        }
    }
}
