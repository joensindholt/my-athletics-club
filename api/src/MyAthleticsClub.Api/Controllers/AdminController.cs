using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using MyAthleticsClub.Api.ViewModels;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Api.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class AdminController : Controller
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IEmailService _emailService;

        public AdminController(IServiceProvider serviceProvider, IEmailService emailService)
        {
            _serviceProvider = serviceProvider;
            _emailService = emailService;
        }

        [HttpGet("api/health")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(string), 200)]
        public IActionResult GetHealth()
        {
            return Ok("health");
        }

        [HttpGet("api/admin/config")]
        [ProducesResponseType(typeof(AdminConfigResponse), 200)]
        public IActionResult GetConfig()
        {
            var result = _serviceProvider.GetRequiredService<AdminConfigResponse>();
            return Ok(result);
        }

        [HttpPost("api/admin/email/send")]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(Exception), 200)]
        public async Task<IActionResult> SendEmail([FromBody]SendEmailRequest request, CancellationToken cancellationToken)
        {
            try
            {
                await _emailService.SendEmailAsync(new List<string> { request.To }, request.Subject, request.Body, cancellationToken);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }

            return Ok("Email send successfully. Check your inbox.");
        }
    }
}
