using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Core.StorageEntities
{
    public class ResultEntity : TableEntity
    {
        public string Json { get; set; }

        public ResultEntity()
        {
            ETag = "*";
        }

        public ResultEntity(string json) : base("gik", "1")
        {
            Json = json;
            ETag = "*";
        }
    }
}
