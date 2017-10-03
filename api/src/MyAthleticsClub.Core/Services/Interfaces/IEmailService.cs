using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(IEnumerable<string> to, string subject, string body);
    }
}
