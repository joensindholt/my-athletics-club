using Microsoft.WindowsAzure.Storage.Table;

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
            string slug,
            string organizationId,
            string name) : base(organizationId, slug)
        {
            Name = name;
            ETag = "*";
        }
    }
}
