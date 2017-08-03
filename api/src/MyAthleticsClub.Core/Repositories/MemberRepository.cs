using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using MyAthleticsClub.Core.Models;
using MyAthleticsClub.Core.Repositories.Interfaces;
using MyAthleticsClub.Core.StorageEntities;

namespace MyAthleticsClub.Core.Repositories
{
    public class MemberRepository : AzureStorageRepository<Member, MemberEntity>, IMemberRepository
    {
        public MemberRepository(CloudStorageAccount account)
            : base(account, "members")
        {
        }

        public async Task<int> CountAllAsync(string organizationId)
        {
            var all = await base.GetAllByPartitionKey(organizationId);
            return all.Count();
        }

        protected override Member ConvertEntityToObject(MemberEntity entity)
        {
            var member = new Member(
                entity.PartitionKey,
                entity.RowKey,
                entity.Number,
                entity.Name,
                entity.Email,
                entity.Email2,
                entity.FamilyMembershipNumber,
                entity.BirthDate != null ? (DateTime?)DateTime.Parse(entity.BirthDate, CultureInfo.InvariantCulture) 
                                         : null);

            return member;
        }

        protected override MemberEntity ConvertObjectToEntity(Member member)
        {
            var entity = new MemberEntity(
                member.OrganizationId,
                member.Id,
                member.Number,
                member.Name,
                member.Email,
                member.Email2,
                member.FamilyMembershipNumber,
                member.BirthDate);

            return entity;
        }
    }
}
