using System.Threading.Tasks;
using Moq;
using MyAthleticsClub.Api.Application.Common.Exceptions;
using MyAthleticsClub.Api.Application.Features.Members.CreateMember;
using Xunit;

namespace MyAthleticsClub.Api.Tests.IntegrationTests.MemberTests
{
    public class CreateMemberTests : IntegrationTest
    {
        [Fact]
        public async Task CreateMember_ThrowsValidationException_WhenNoNameIsSupplied()
        {
            // Arrange
            var request = new CreateMemberRequest();

            // Act & Assert
            await Assert.ThrowsAsync<ValidationException>(async () =>
            {
                await mediator.Send(request);
            });
        }

        [Fact]
        public async Task CreateMember_AddsMember_WhenValidRequestIsMade()
        {
            // Arrange
            var request = new CreateMemberRequest
            {
                Name = "John Doe"
            };

            // Act
            await mediator.Send(request);

            // Assert
            tableStorageRepositoryMock.Verify(m => m.Add(It.IsAny<object>()), Times.Once);
        }
    }
}