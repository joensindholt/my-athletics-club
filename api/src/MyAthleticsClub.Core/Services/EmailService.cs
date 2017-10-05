using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using MyAthleticsClub.Core.Services.Interfaces;

namespace MyAthleticsClub.Core.Services
{
    /// <summary>
    /// Simple email service used for sending out emails
    /// </summary>
    public class EmailService : IEmailService
    {
        private readonly EmailOptions _options;

        public EmailService(IOptions<EmailOptions> options)
        {
            _options = options.Value;
        }

        public async Task SendEmailAsync(IEnumerable<string> to, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_options.FromName, _options.FromEmail));

            foreach (var email in to)
            {
                message.To.Add(new MailboxAddress(email));
            }

            message.Subject = subject;

            message.Body = new TextPart(TextFormat.Html)
            {
                Text = body
            };

            using (var client = new MailKit.Net.Smtp.SmtpClient())
            {
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                client.Connect(_options.Host, _options.Port, _options.UseSsl);
                await client.AuthenticateAsync(_options.Username, _options.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }

    public class EmailOptions
    {
        public string Host { get; set; } = "smtp.gmail.com";
        public int Port { get; set; } = 465;
        public bool UseSsl { get; set; } = true;
        public string FromName { get; set; }
        public string FromEmail { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public void Verify()
        {
            if (FromName == null) throw new ArgumentException("Invalid EmailOptions", nameof(FromName));
            if (FromEmail == null) throw new ArgumentException("Invalid EmailOptions", nameof(FromEmail));
            if (Username == null) throw new ArgumentException("Invalid EmailOptions", nameof(Username));
            if (Password == null) throw new ArgumentException("Invalid EmailOptions", nameof(Password));
        }
    }
}
