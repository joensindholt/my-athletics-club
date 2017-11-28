using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using HandlebarsDotNet;
using Microsoft.Extensions.Options;
using SendGrid;

namespace MyAthleticsClub.Core.Services.Email
{
    public class SendGridService : IEmailTemplateProvider, ITemplateMerger
    {
        private readonly EmailOptions _options;

        public SendGridService(IOptions<EmailOptions> options)
        {
            _options = options.Value;
        }

        public async Task<IEmailTemplate> GetTemplateAsync(string id, CancellationToken cancellationToken)
        {
            var client = new SendGridClient(_options.ApiKey);

            var response =
                await client.RequestAsync(
                    method: SendGridClient.Method.GET,
                    urlPath: $"/templates/{id}",
                    cancellationToken: cancellationToken);

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Got unexpected status code '{response.StatusCode}' getting template with id '{id}' using api key '{_options.ApiKey}'");
            }

            var template = SendGridTemplate.FromJson(await response.Body.ReadAsStringAsync());

            return template;
        }

        public string Merge(string template, object data)
        {
            var result = Handlebars.Compile(template)(data);
            return result;
        }
    }
}
