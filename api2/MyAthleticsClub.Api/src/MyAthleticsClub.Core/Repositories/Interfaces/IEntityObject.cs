namespace MyAthleticsClub.Core.Repositories.Interfaces
{
    public interface IEntityObject
    {
        string GetPartitionKey();

        string GetRowKey();
    }
}
