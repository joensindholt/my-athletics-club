namespace MyAthleticsClub.Api
{
    public interface IEntityObject
    {
        string Id { get; }

        string GetPartitionKey();
    }
}