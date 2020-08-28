using System;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Email
{
    public class EmbeddedEmailTemplateProvider : IEmailTemplateProvider
    {
        public async Task<IEmailTemplate> GetTemplateAsync(string id, CancellationToken cancellationToken)
        {
            var template = GetTemplate(id);

            var assembly = Assembly.GetExecutingAssembly();
            var resourceStream = assembly.GetManifestResourceStream($"MyAthleticsClub.Core.Email.Templates.{template.Resource}");
            using (var reader = new StreamReader(resourceStream, Encoding.UTF8))
            {
                string content = await reader.ReadToEndAsync();
                template.Content = content;
                return template;
            }
        }

        private EmbeddedEmailTemplate GetTemplate(string id)
        {
            switch (id)
            {
                case "36c480cb-d7af-4f2b-be89-22e77b2d26d3":
                    return new EmbeddedEmailTemplate(subject: "Bekræftelse af tilmelding", resource: "event-registration-receipt.html");
                case "09c61205-5850-4fd5-832e-26879c8824ca":
                    return new EmbeddedEmailTemplate(subject: "Tak for din indmeldelse", resource: "enrollment-receipt.html");
                case "393d49c0-7f3d-4ea9-900d-4bbef952bd5e":
                    return new EmbeddedEmailTemplate(subject: "Indmeldelse modtaget", resource: "enrollment-notification-to-gik.html");
                default:
                    throw new Exception($"Unknown template id: {id}");
            }
        }
    }
}
