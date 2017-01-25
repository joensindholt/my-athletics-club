namespace MyAthleticsClub.Api.SysEvents
{
    public class SysEvent : IEntityObject
    {
        public string Id { get; set; }
        public string OrganizationId { get; set; }

        public SysEvent()
        {
        }

        public SysEvent(
            string id,
            string organizationId) : this()
        {
            Id = id;
            OrganizationId = organizationId;
        }

        public string GetPartitionKey()
        {
            return OrganizationId;
        }
    }
}