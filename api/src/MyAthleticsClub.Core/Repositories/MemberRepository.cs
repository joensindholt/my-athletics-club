using System;
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

        public override Task CreateAsync(Member member)
        {
            return base.CreateAsync(member);
        }

        protected override Member ConvertEntityToObject(MemberEntity entity)
        {
            var member = new Member(
                entity.Name,
                entity.RowKey,
                entity.PartitionKey);

            return member;
        }

        protected override MemberEntity ConvertObjectToEntity(Member member)
        {
            var entity = new MemberEntity(
                member.Name,
                member.Slug,
                member.OrganizationId);

            return entity;
        }
    }
}
