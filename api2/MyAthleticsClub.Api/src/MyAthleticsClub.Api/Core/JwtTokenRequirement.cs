using Microsoft.AspNetCore.Authorization;
using MyAthleticsClub.Api.Users;
using System;
using System.Threading.Tasks;

namespace MyAthleticsClub.Api.Core
{
    public class JwtTokenRequirement : IAuthorizationRequirement
    {
    }

    public class JwtTokenRequirementHandler : AuthorizationHandler<JwtTokenRequirement>
    {
        private readonly IUserService _userService;

        public JwtTokenRequirementHandler(IUserService userService)
        {
            _userService = userService;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, JwtTokenRequirement requirement)
        {
            // Check for Mvc context
            var mvcContext = context.Resource as Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext;
            if (mvcContext == null)
            {
                context.Fail();
                return Task.CompletedTask;
            }

            // Get token from request header
            var authorizationHeader = mvcContext.HttpContext.Request.Headers["Authorization"];
            if (string.IsNullOrWhiteSpace(authorizationHeader))
            {
                context.Fail();
                return Task.CompletedTask;
            }

            var token = authorizationHeader[0].Split(' ')[1];

            // Validate and read token
            string username;
            try
            {
                username = _userService.ValidateToken(token);
            }
            catch (Exception ex)
            {
                context.Fail();
                return Task.CompletedTask;
            }

            // Check username
            if (string.IsNullOrWhiteSpace(username))
            {
                context.Fail();
                return Task.CompletedTask;
            }

            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}