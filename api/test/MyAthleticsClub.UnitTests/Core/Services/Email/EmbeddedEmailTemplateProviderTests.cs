using System.Threading;
using MyAthleticsClub.Core.Email;
using Xunit;

namespace MyAthleticsClub.UnitTests.Core.Services.Email
{
    public class EmbeddedEmailTemplateProviderTests
    {
        [Theory]
        [InlineData("36c480cb-d7af-4f2b-be89-22e77b2d26d3", "Bekræftelse af tilmelding", "<div><strong>Hej {{registration.name}}</strong></div>")]
        [InlineData("09c61205-5850-4fd5-832e-26879c8824ca", "Tak for din indmeldelse", "<div>Velkommen til GIK Atletik.</div>")]
        [InlineData("393d49c0-7f3d-4ea9-900d-4bbef952bd5e", "Indmeldelse modtaget", "<div>Et nyt medlem er meldt ind via hjemmesiden</div>")]
        public async void WhenPassingValidTempalteId_ItReturnsAValidTemplate(string id, string subject, string content)
        {
            // Arrange
            var provider = new EmbeddedEmailTemplateProvider();

            // Act
            var template = await provider.GetTemplateAsync(id, CancellationToken.None);

            // Assert
            Assert.Equal(subject, template.GetSubject());
            Assert.Contains(content, template.GetHtmlContent());
        }
    }
}
