using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MyAthleticsClub.Core.Members
{
    public interface IMemberMessageRepository
    {
        Task CreateAsync(MemberMessage message, CancellationToken cancellationToken);

        Task<IEnumerable<MemberMessage>> GetMemberMessages(string memberId);
    }
}
