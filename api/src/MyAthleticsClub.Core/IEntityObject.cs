namespace MyAthleticsClub.Core
{
    public interface IEntityObject
    {
        string GetPartitionKey();

        string GetRowKey();
    }
}
