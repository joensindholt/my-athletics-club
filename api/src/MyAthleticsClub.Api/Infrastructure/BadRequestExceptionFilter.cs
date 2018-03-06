using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MyAthleticsClub.Core.Shared.Exceptions;

namespace MyAthleticsClub.Api.Infrastructure
{
    public class BadRequestExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is BadRequestException)
            {
                context.Result = new BadRequestObjectResult(context.Exception.Message);
            }
        }
    }
}
