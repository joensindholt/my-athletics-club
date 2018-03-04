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
                Members = new List<EnrollmentRequestMember>
                {
                    new EnrollmentRequestMember { Name = "John", BirthDate = "13-02-2005" },
                    new EnrollmentRequestMember { Name = "Jane", BirthDate = "12-07-2012" }
                },
                Comments = "These are my comments\nwith a newline and all"
            };

            var emailOptionsMock = Substitute.For<IOptions<EmailOptions>>();
            emailOptionsMock.Value.Returns(new EmailOptions
            {
                Templates = new EmailTemplates
                {
                    EnrollmentAdminNotification = "123"
                }
            });

            var emailServiceMock = Substitute.For<IEmailService>();
            var enrollmentOptions = Substitute.For<IOptions<EnrollmentOptions>>();
            enrollmentOptions.Value.Returns(new EnrollmentOptions());

            var enrollmentService = new EnrollmentService(enrollmentOptions, emailServiceMock, emailOptionsMock);

            // Act
            await enrollmentService.EnrollAsync(enrollment, CancellationToken.None);

            // Assert
            await emailServiceMock.Received(1).SendTemplateEmailAsync(
                to: "gik.atletik@gmail.com",
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
                Members = new List<EnrollmentRequestMember>
                {
                    new EnrollmentRequestMember { Name = "John", BirthDate = "13-02-2005" },
                    new EnrollmentRequestMember { Name = "Jane", BirthDate = "12-07-2012" }
                },
                Comments = "These are my comments\nwith a newline and all"
            };

            var emailOptionsMock = Substitute.For<IOptions<EmailOptions>>();
            emailOptionsMock.Value.Returns(new EmailOptions
            {
                Templates = new EmailTemplates
                {
                    EnrollmentReceipt = "456"
                }
            });

            var emailServiceMock = Substitute.For<IEmailService>();
            var enrollmentOptions = Substitute.For<IOptions<EnrollmentOptions>>();
            enrollmentOptions.Value.Returns(new EnrollmentOptions());

            var enrollmentService = new EnrollmentService(enrollmentOptions, emailServiceMock, emailOptionsMock);

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
