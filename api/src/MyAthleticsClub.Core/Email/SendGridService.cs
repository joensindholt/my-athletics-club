using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using HandlebarsDotNet;
using Microsoft.Extensions.Options;
using SendGrid;

namespace MyAthleticsClub.Core.Email
{
    public class SendGridService : IEmailTemplateProvider, ITemplateMerger
    {
        private readonly string _templateProviderApiKey;

        public SendGridService(IOptions<EmailOptions> options)
        {
            _templateProviderApiKey = options.Value.TemplateProviderApiKey;
        }

        public async Task<IEmailTemplate> GetTemplateAsync(string id, CancellationToken cancellationToken)
        {
            var client = new SendGridClient(_templateProviderApiKey);

            var response =
                await client.RequestAsync(
                    method: SendGridClient.Method.GET,
                    urlPath: $"/templates/{id}",
                    cancellationToken: cancellationToken);

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Got unexpected status code '{response.StatusCode}' getting template with id '{id}' using api key '{_templateProviderApiKey}'");
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
