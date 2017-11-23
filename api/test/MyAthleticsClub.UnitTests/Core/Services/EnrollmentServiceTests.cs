using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Core.Models.Requests;
using MyAthleticsClub.Core.Services;
using MyAthleticsClub.Core.Services.Interfaces;
using NSubstitute;
using NUnit.Framework;

namespace MyAthleticsClub.UnitTests.Core.Services
{
    [TestFixture]
    public class EnrollmentServiceTests
    {
        [Test]
        public async Task SendsExpectedEmailToGIKOnEnrollment()
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
            var enrollmentOptions = Substitute.For<IOptions<EnrollmentOptions>>();
            enrollmentOptions.Value.Returns(new EnrollmentOptions());

            var enrollmentService = new EnrollmentService(enrollmentOptions, emailServiceMock);

            // Act
            await enrollmentService.EnrollAsync(enrollment, CancellationToken.None);

            // Assert
            var expectedBody =
                $"<div>En person har indsendt en indmeldelse via hjemmesiden</div>" +
                $"<div>&nbsp;</div>" +
                $"<div><strong>Email:</strong></div>" +
                $"<div>test@test.dk</div>" +
                $"<div>&nbsp;</div>" +
                $"<div><strong>Personer der skal indmeldes:</strong></div>" +
                $"<div>Navn: John, Fødselsdato: 13-02-2005</div>" +
                $"<div>Navn: Jane, Fødselsdato: 12-07-2012</div>" +
                $"<div>&nbsp;</div>" +
                $"<div><strong>Kommentarer:</strong></div>" +
                $"<div style=\"white-space: pre;\">These are my comments\nwith a newline and all</div>";

            await emailServiceMock.Received(1).SendEmailAsync("gik.atletik@gmail.com", "Ny indmeldelse", expectedBody, CancellationToken.None);
        }

        [Test]
        public async Task SendsExpectedEmailToEmailSpecifiedOnEnrollment()
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
            var enrollmentOptions = Substitute.For<IOptions<EnrollmentOptions>>();
            enrollmentOptions.Value.Returns(new EnrollmentOptions());

            var enrollmentService = new EnrollmentService(enrollmentOptions, emailServiceMock);

            // Act
            await enrollmentService.EnrollAsync(enrollment, CancellationToken.None);

            // Assert
            var expectedBody = $"<div>Vis skal have noget tekst i den her mail</div>";

            await emailServiceMock.Received(1).SendEmailAsync(enrollment.Email, "Tak for din indmeldelse", expectedBody, CancellationToken.None);
        }
    }
}
