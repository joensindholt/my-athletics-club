namespace MyAthleticsClub.Core.Users
{
    public class User : IEntityObject
    {
        public string OrganizationId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public User()
        {
        }

        public User(string organizationId, string username, string password)
        {
            OrganizationId = organizationId;
            Username = username;
            Password = password;
        }

        public string GetPartitionKey()
        {
            return OrganizationId;
        }

        public string GetRowKey()
        {
            return Username;
        }
    }
}
