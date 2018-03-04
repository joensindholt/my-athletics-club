using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Enrollments
{
    public interface IEnrollmentService
    {
        Task EnrollAsync(EnrollmentRequest enrollment, CancellationToken cancellationToken);
    }
}
