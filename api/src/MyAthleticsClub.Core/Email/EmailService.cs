using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using MailKit;
using MailKit.Security;
using MarkdownSharp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace MyAthleticsClub.Core.Email
{
    /// <summary>
    /// Simple email service used for sending out emails
    /// </summary>
    public class EmailService : IEmailService
    {
        private readonly EmailOptions _options;
        private readonly IEmailTemplateProvider _emailTemplateProvider;
        private readonly ITemplateMerger _templateMerger;
        private readonly ILogger<EmailService> _logger;
        private readonly Markdown _markdown = new Markdown();

        public EmailTemplates Templates => _options.Templates;

        public EmailService(
            IOptions<EmailOptions> options,
            IEmailTemplateProvider emailTemplateProvider,
            ITemplateMerger templateMerger,
            ILogger<EmailService> logger)
        {
            _options = options.Value;
            _emailTemplateProvider = emailTemplateProvider;
            _templateMerger = templateMerger;
            _logger = logger;
        }

        public async Task<SentEmail> SendTemplateEmailAsync(string to, string templateId, object data, CancellationToken cancellationToken)
        {
            return await SendTemplateEmailAsync(new List<string> { to }, templateId, data, cancellationToken);
        }

        public async Task<SentEmail> SendTemplateEmailAsync(IEnumerable<string> to, string templateId, object data, CancellationToken cancellationToken)
        {
            var template = await _emailTemplateProvider.GetTemplateAsync(templateId, cancellationToken);
            var subject = _templateMerger.Merge(template.GetSubject(), data);
            var htmlContent = _templateMerger.Merge(template.GetHtmlContent(), data);
            return await SendEmailAsync(to, subject, htmlContent, cancellationToken);
        }

        public async Task<SentEmail> SendMarkdownEmail(IEnumerable<string> to, string subject, string template, object data, CancellationToken cancellation)
        {
            var mergedContent = _templateMerger.Merge(template, data);
            var htmlContent = _markdown.Transform(mergedContent);
            return await SendEmailAsync(to, subject, htmlContent, cancellation);
        }

        private async Task<SentEmail> SendEmailAsync(IEnumerable<string> to, string subject, string body, CancellationToken cancellationToken)
        {
            if (!_options.Enabled)
            {
                _logger.LogInformation($"Email sending is disabled. No email was sent. Would have sent:\n" +
                    $"To: {string.Join(", ", to)}\n" +
                    $"Subject: {subject}\n" +
                    $"{body}");

                return new SentEmail(to, subject + " (EMAIL DISABLED - NOT REALLY SENT)", body, sent: DateTime.UtcNow);
            }

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
                client.Connect(_options.Host, _options.Port, SecureSocketOptions.SslOnConnect);
                await client.AuthenticateAsync(_options.Username, _options.Password, cancellationToken);
                await client.SendAsync(message, cancellationToken);
                await client.DisconnectAsync(true, cancellationToken);
            }

            return new SentEmail(to, subject, body, sent: DateTime.UtcNow);
        }
    }

    public class EmailOptions
    {
        public string Host { get; set; } = "smtp.gmail.com";

        public int Port { get; set; } = 465;

        public string FromName { get; set; }

        public string FromEmail { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public bool Enabled { get; set; } = true;

        public EmailTemplates Templates { get; set; }

        public string TemplateProviderApiKey { get; set; }

        public EmailOptions()
        {
            Templates = new EmailTemplates();
        }

        public void Verify()
        {
            if (!Enabled)
            {
                // We do not verify email options if sending out emails is not enabled at all
                return;
            }

            if (FromName == null) throw new ArgumentException("Invalid EmailOptions", nameof(FromName));
            if (FromEmail == null) throw new ArgumentException("Invalid EmailOptions", nameof(FromEmail));
            if (Username == null) throw new ArgumentException("Invalid EmailOptions", nameof(Username));
            if (Password == null) throw new ArgumentException("Invalid EmailOptions", nameof(Password));
            if (Templates == null) throw new ArgumentException("Invalid EmailOptions", nameof(Templates));
            if (TemplateProviderApiKey == null) throw new ArgumentException("Invalid EmailOptions", nameof(TemplateProviderApiKey));

            Templates.Verify();
        }
    }

    /// <summary>
    /// Contains the list of templates created in SendGrid
    /// </summary>
    public class EmailTemplates
    {
        public string EnrollmentAdminNotification { get; set; } = "393d49c0-7f3d-4ea9-900d-4bbef952bd5e";
        public string EnrollmentReceipt { get; set; } = "09c61205-5850-4fd5-832e-26879c8824ca";
        public string EventRegistrationReceipt { get; set; } = "36c480cb-d7af-4f2b-be89-22e77b2d26d3";
        public string SubscriptionReminderOne { get; set; }
        public string SubscriptionReminderTwo { get; set; }
        public string SubscriptionReminderThree { get; set; }

        public void Verify()
        {
            if (EnrollmentAdminNotification == null) throw new ArgumentException("Invalid Templates in EmailOptions", nameof(EnrollmentAdminNotification));
            if (EnrollmentReceipt == null) throw new ArgumentException("Invalid Templates in EmailOptions", nameof(EnrollmentReceipt));
            if (EventRegistrationReceipt == null) throw new ArgumentException("Invalid Templates in EmailOptions", nameof(EventRegistrationReceipt));
            if (SubscriptionReminderOne == null) throw new ArgumentException("Invalid Templates in EmailOptions", nameof(SubscriptionReminderOne));
            if (SubscriptionReminderTwo == null) throw new ArgumentException("Invalid Templates in EmailOptions", nameof(SubscriptionReminderTwo));
            if (SubscriptionReminderThree == null) throw new ArgumentException("Invalid Templates in EmailOptions", nameof(SubscriptionReminderThree));
        }
    }
}
