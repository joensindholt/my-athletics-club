using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MyAthleticsClub.Api.Application.Common.Exceptions;

namespace MyAthleticsClub.Api.WebApi.Common
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly bool _isDevelopment;

        public ExceptionMiddleware(RequestDelegate next, bool isDevelopment)
        {
            _next = next;
            _isDevelopment = isDevelopment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (NotFoundException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                await context.Response.WriteAsync("Resource not found");
            }
            catch (ValidationException ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await context.Response.WriteAsync(ex.ToString());
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                if (_isDevelopment)
                {
                    await context.Response.WriteAsync(ex.Message);
                    await context.Response.WriteAsync(ex.StackTrace);
                }
                else
                {
                    await context.Response.WriteAsync("An internal error occured");
                }
            }
        }
    }
}