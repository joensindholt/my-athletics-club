using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MyAthleticsClub.Migrate
{
    public class MongoRepository<T>
    {
        private readonly MongoClient _mongoClient;
        private readonly IMongoCollection<T> _collection;

        public MongoRepository(MongoClient mongoClient, string collectionName)
        {
            _mongoClient = mongoClient;
            _collection = _mongoClient.GetDatabase("myathleticsclub").GetCollection<T>(collectionName);
        }

        protected async Task<IEnumerable<T>> GetAll()
        {
            return (await _collection.FindAsync(new BsonDocument())).ToEnumerable();
        }
    }
}
