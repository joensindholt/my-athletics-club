using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Api.Core.Authentication;
using MyAthleticsClub.Api.Endpoints.Users;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;
using Newtonsoft.Json.Linq;
using NSubstitute;
using Xunit;

namespace MyAthleticsClub.Api.UnitTests.Endpoints.Users.Services
{
    public class UserControllerTests
    {
        [Fact]
        public async Task CanLoginAndGetToken()
        {
            // Arrange
            var user = new User { Username = "myuser", Password = "mypassword" };

            var userServiceMock = Substitute.For<IUserService>();
            userServiceMock.TryGetClaimsIdentityAsync(user).Returns(new ClaimsIdentity());

            var optionsMock = Substitute.For<IOptions<JwtIssuerOptions>>();

            var loggerMock = Substitute.For<ILogger<UserController>>();

            var userController = new UserController(optionsMock, loggerMock, userServiceMock);

            // Act
            var result = await userController.Login(user);

            // Assert
            Assert.True(result is OkObjectResult, "A OK response was expected");
            Assert.True(((OkObjectResult)result).Value is string);
            Assert.True(JObject.Parse(((string)((OkObjectResult)result).Value))["access_token"].Value<string>().Length > 0);
        }
    }
}