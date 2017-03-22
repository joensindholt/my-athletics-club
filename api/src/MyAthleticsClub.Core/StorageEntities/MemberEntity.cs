using Microsoft.WindowsAzure.Storage.Table;
using System;

namespace MyAthleticsClub.Core.StorageEntities
{
    public class MemberEntity : TableEntity
    {
        public string Name { get; set; }

        public MemberEntity()
        {
            ETag = "*";
        }

        public MemberEntity(
            string id,
            string organizationId,
            string name) : base(organizationId, id)
        {
            Name = name;
            ETag = "*";
        }
    }
}
