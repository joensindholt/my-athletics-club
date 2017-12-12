using System;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MyAthleticsClub.Api.Controllers;
using MyAthleticsClub.Api.Core.Authentication;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Services.Interfaces;
using Newtonsoft.Json.Linq;
using NSubstitute;
using NUnit.Framework;

namespace MyAthleticsClub.UnitTests.Api.Controllers
{
    [TestFixture]
    public class UserControllerTests
    {
        [Test]
        public async Task WhenAUserLogsIn_AnOkResponseAndATokenIsReturned()
        {
            // Arrange
            var user = new User { Username = "myuser", Password = "mypassword" };

            var userServiceMock = Substitute.For<IUserService>();
            userServiceMock.TryGetClaimsIdentityAsync(user).Returns(new ClaimsIdentity());

            var userController =
                new UserController(
                    Options.Create(GetTestJwtOptions()),
                    Substitute.For<ILogger<UserController>>(),
                    userServiceMock,
                    Substitute.For<HttpClient>());

            // Act
            var result = await userController.Login(user);

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>(), "An OK response was expected");
            Assert.That(((OkObjectResult)result).Value, Is.TypeOf<string>());
            Assert.True(JObject.Parse(((string)((OkObjectResult)result).Value))["access_token"].Value<string>().Length > 0);
        }

        private static JwtIssuerOptions GetTestJwtOptions()
        {
            const string sec = "401b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1";
            var now = DateTime.UtcNow;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(sec));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var jwtOptions = new JwtIssuerOptions
            {
                ValidFor = TimeSpan.FromHours(1),
                SigningCredentials = signingCredentials
            };
            return jwtOptions;
        }
    }
}
