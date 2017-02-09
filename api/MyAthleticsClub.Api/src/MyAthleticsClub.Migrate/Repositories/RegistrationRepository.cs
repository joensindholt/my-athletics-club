using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Migrate.Repositories
{
    public class RegistrationRepository : MongoRepository<BsonDocument>
    {
        public RegistrationRepository(MongoClient mongoClient) : base(mongoClient, "registrations")
        {
        }

        public async Task<List<Registration>> GetRegistrations()
        {
            var bsonRegistrations = await GetAll();
            var registrations = bsonRegistrations.Select(be => ConvertBsonToObject(be)).ToList();
            return registrations;
        }

        private static Registration ConvertBsonToObject(BsonDocument be)
        {
            var registration = new Registration(
                id: be["_id"].AsObjectId.ToString(),
                eventId: be["eventId"].AsString,
                name: be["name"].AsString,
                email: be["email"].AsString,
                ageClass: be["ageClass"].AsString,
                birthYear: be["birthYear"].AsString,
                disciplines: be["disciplines"].AsBsonArray.Select(e => new RegistrationDiscipline(
                    id: e["id"].AsString,
                    name: e["name"].AsString,
                    personalRecord: ((BsonDocument)e).Contains("personalRecord") ? e["personalRecord"].AsString : null
                )).ToList(),
                extraDisciplines: new List<RegistrationExtraDiscipline>()
            );

            return registration;
        }
    }
}
