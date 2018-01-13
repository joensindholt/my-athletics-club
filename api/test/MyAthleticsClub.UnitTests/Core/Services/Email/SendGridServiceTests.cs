using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Models.Requests;
using MyAthleticsClub.Core.Services.Email;
using NSubstitute;
using NUnit.Framework;

namespace MyAthleticsClub.UnitTests.Core.Services.Email
{
    [TestFixture]
    public class SendGridServiceTests
    {
        [Test]
        public void WhenMergingValidEmailTemplates_TheResultIsAsExpected()
        {
            // Arrange
            var template = "Hey, I'm a {{template}}";
            var data = new { template = "Test" };

            var sendGridService = BuildSendGridService();

            // Act
            var result = sendGridService.Merge(template, data);

            // Assert
            Assert.That(result, Is.EqualTo("Hey, I'm a Test"));
        }

        [Test]
        public void WhenMissingAFieldInATemplate_MergingStillSucceeds()
        {
            // Arrange
            var template = "Hey, I'm a {{template}} with a missing {{templateKey}}";
            var data = new { template = "Test" };

            var sendGridService = BuildSendGridService();

            // Act
            var result = sendGridService.Merge(template, data);

            // Assert
            Assert.That(result, Is.EqualTo("Hey, I'm a Test with a missing "));
        }

        [Test]
        public void WhenMerging_UsingPascalCamelCasedPropertiesCanBeUsedWithCamelCasedTemplateReferences()
        {
            // Arrange
            var camelCasedTemplate = "Hey, I'm a {{template}}";
            var pascalCamelCasedData = new { Template = "Test" };

            var sendGridService = BuildSendGridService();

            // Act
            var result = sendGridService.Merge(camelCasedTemplate, pascalCamelCasedData);

            // Assert
            Assert.That(result, Is.EqualTo("Hey, I'm a Test"));
        }

        [Test]
        public void WhenMerging_NestedObjectsCanBeUsed()
        {
            // Arrange
            var template = "Hey {{person.name}}";
            var data = new
            {
                Person = new
                {
                    Name = "John"
                }
            };

            var sendGridService = BuildSendGridService();

            // Act
            var result = sendGridService.Merge(template, data);

            // Assert
            Assert.That(result, Is.EqualTo("Hey John"));
        }

        [Test]
        [Explicit("Sends real messages so be careful")]
        public async Task SendRealEmail()
        {
            var username = "<NOPE>";
            var password = "<NOPE>";
            var receiverEmail = "<NOPE>";

            var templateId = "36c480cb-d7af-4f2b-be89-22e77b2d26d3";
            var data = new
            {
                Registration = new Registration
                {
                    Id = "123",
                    Name = "John Doe",
                    AgeClass = "D10",
                    BirthYear = "20-06-1979",
                    Email = receiverEmail,
                    EventId = "456",
                    Disciplines = new List<RegistrationDiscipline>
                    {
                        new RegistrationDiscipline { Name = "60 m", PersonalRecord = "12s" },
                        new RegistrationDiscipline { Name = "100 m", PersonalRecord = "15s" }
                    },
                    ExtraDisciplines = new List<RegistrationExtraDiscipline>
                    {
                        new RegistrationExtraDiscipline { Name = "Spydkast", AgeClass = "P12", PersonalRecord = "60m" }
                    }
                },
                Event = new Event
                {
                    Title = "Sommerstævne"
                },
                Date = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss")
            };

            var emailOptions = Substitute.For<IOptions<EmailOptions>>();
            emailOptions.Value.Returns(new EmailOptions
            {
                FromName = "GIK (test)",
                FromEmail = "gik.atletik@gmail.com",
                Username = username,
                Password = password,
                Host = "smtp.sendgrid.net"
            });

            var emailService = new EmailService(emailOptions, new SendGridService(emailOptions), new SendGridService(emailOptions));

            await emailService.SendTemplateEmailAsync(
                to: receiverEmail,
                templateId: templateId,
                data: data,
                cancellationToken: CancellationToken.None);
        }

        private SendGridService BuildSendGridService()
        {
            var emailOptionsMock = Substitute.For<IOptions<EmailOptions>>();
            var sendGridService = new SendGridService(emailOptionsMock);
            return sendGridService;
        }

        private EnrollmentRequest GetEnrollmentEmailData()
        {
            return new EnrollmentRequest
            {
                Email = "some@email.com",
                Members = new List<EnrollmentRequestMember>
                {
                    new EnrollmentRequestMember { Name = "John Doe", BirthDate = "20-06-1079"},
                    new EnrollmentRequestMember { Name = "Jane Doe", BirthDate = "12-07-1980"}
                },
                Comments = "I have comments"
            };
        }
    }
}