using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.StorageEntities
{
    public class UserEntity : TableEntity
    {
        public string OrganizationId
        {
            get { return PartitionKey; }
            set { PartitionKey = value; }
        }

        public string Username
        {
            get { return RowKey; }
            set { RowKey = value; }
        }

        public string Password { get; set; }

        public UserEntity()
        {
            ETag = "*";
        }

        public UserEntity(
            string organizationId,
            string username,
            string password) : base(organizationId, username)
        {
            ETag = "*";
            Password = password;
        }
    }
}