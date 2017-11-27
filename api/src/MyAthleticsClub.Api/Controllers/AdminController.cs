using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MyAthleticsClub.Api.ViewModels;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Api.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class AdminController : Controller
    {
        private readonly AdminOptions _options;
        private readonly IServiceProvider _serviceProvider;
        private readonly IEmailService _emailService;

        public AdminController(
            IOptions<AdminOptions> options,
            IServiceProvider serviceProvider,
            IEmailService emailService)
        {
            _options = options.Value;
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
        [AllowAnonymous]
        [ProducesResponseType(typeof(AdminConfigResponse), 200)]
        public IActionResult GetConfig([FromHeader]string apikey)
        {
            if (apikey != _options.ConfigApiKey)
            {
                return Unauthorized();
            }

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
                await _emailService.SendTemplateEmailAsync(
                    to: request.To,
                    templateId: request.TemplateId,
                    data: request.Data,
                    cancellationToken: cancellationToken);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }

            return Ok("Email send successfully. Check your inbox.");
        }
    }

    public class AdminOptions
    {
        public string ConfigApiKey { get; set; }
    }
}
