using System.Threading;
using System.Threading.Tasks;
using MyAthleticsClub.Core.Models.Requests;

namespace MyAthleticsClub.Core.Services.Interfaces
{
    public interface IEnrollmentService
    {
        Task EnrollAsync(EnrollmentRequest enrollment, CancellationToken cancellationToken);
    }
}
