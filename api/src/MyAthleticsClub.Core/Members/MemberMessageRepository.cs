using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;

namespace MyAthleticsClub.Core.Members
{
    public class MemberMessageRepository :
        AzureStorageRepository<MemberMessage, MemberMessageEntity>,
        IMemberMessageRepository
    {
        public MemberMessageRepository(CloudStorageAccount account)
            : base(account, "membermessages")
        {
        }

        public Task CreateAsync(MemberMessage message, CancellationToken cancellationToken)
        {
            return CreateInternalAsync(message);
        }

        public async Task<IEnumerable<MemberMessage>> GetMemberMessages(string memberId)
        {
            var messages = await GetAllByPartitionKeyInternalAsync(memberId);
            return messages.OrderByDescending(m => m.Sent);
        }

        protected override MemberMessage ConvertEntityToObject(MemberMessageEntity entity)
        {
            return new MemberMessage(
                entity.MemberId,
                entity.To,
                entity.Subject,
                entity.HtmlContent,
                entity.Sent);
        }

        protected override MemberMessageEntity ConvertObjectToEntity(MemberMessage message)
        {
            return new MemberMessageEntity(
                message.Id,
                message.MemberId,
                message.To,
                message.Subject,
                message.HtmlContent,
                message.Sent
            );
        }
    }
}
