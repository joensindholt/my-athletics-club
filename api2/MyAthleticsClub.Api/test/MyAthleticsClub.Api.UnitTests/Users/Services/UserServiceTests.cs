using Microsoft.Extensions.Configuration;
using MyAthleticsClub.Api.Users;
using NSubstitute;
using System.Threading.Tasks;
using Xunit;

namespace MyAthleticsClub.Api.UnitTests.Users
{
    public class UserServiceTests
    {
        [Fact]
        public async Task CanLoginAndGetToken()
        {
            // Arrange
            var user = new User { Username = "myuser", Password = "mypassword" };

            var userRepositoryMock = Substitute.For<IUserRepository>();
            userRepositoryMock.FindByCredentialsAsync(user.Username, user.Password).Returns(user);

            var configurationMock = Substitute.For<IConfigurationRoot>();
            configurationMock.GetValue<string>("MAC_JWT_TOKEN_KEY").Returns("thisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkey");

            var userService = new UserService(userRepositoryMock, configurationMock);

            // Act
            var token = await userService.LoginAsync(user.Username, user.Password);

            // Assert
            Assert.False(string.IsNullOrWhiteSpace(token), "A token should be generated when supplying valid username and password");
        }

        [Fact]
        public async Task CanValidateAndReadToken()
        {
            // Arrange
            var user = new User { Username = "myuser", Password = "mypassword" };

            var userRepositoryMock = Substitute.For<IUserRepository>();
            userRepositoryMock.FindByCredentialsAsync(user.Username, user.Password).Returns(user);

            var configurationMock = Substitute.For<IConfigurationRoot>();
            configurationMock.GetValue<string>("MAC_JWT_TOKEN_KEY").Returns("thisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkeythisisatestkey");

            var userService = new UserService(userRepositoryMock, configurationMock);
            var token = await userService.LoginAsync(user.Username, user.Password);

            // Act
            var tokenUsername = userService.ValidateToken(token);

            // Assert
            Assert.Equal(user.Username, tokenUsername);
        }
    }
}