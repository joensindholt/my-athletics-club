using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Core.Models.Requests;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.Services;
using MyAthleticsClub.Core.Services.Email;
using MyAthleticsClub.Core.Services.Interfaces;
using NSubstitute;
using NUnit.Framework;

namespace MyAthleticsClub.UnitTests.Core.Services
{
    [TestFixture]
    public class EnrollmentServiceTests
    {
        [Test]
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

            var emailServiceMock = Substitute.For<IEmailService>();
            emailServiceMock.Templates.Returns(new EmailTemplates { EnrollmentAdminNotification = "123" });

            var enrollmentOptions = Substitute.For<IOptions<EnrollmentOptions>>();
            enrollmentOptions.Value.Returns(new EnrollmentOptions());

            var enrollmentService = new EnrollmentService(enrollmentOptions, emailServiceMock);

            // Act
            await enrollmentService.EnrollAsync(enrollment, CancellationToken.None);

            // Assert
            await emailServiceMock.Received(1).SendTemplateEmailAsync(
                to: "gik.atletik@gmail.com",
                templateId: "123",
                data: enrollment,
                cancellationToken: CancellationToken.None);
        }

        [Test]
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
