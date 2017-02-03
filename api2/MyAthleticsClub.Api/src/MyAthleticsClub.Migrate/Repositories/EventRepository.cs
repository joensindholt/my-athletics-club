using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MyAthleticsClub.Core.Models;

namespace MyAthleticsClub.Migrate.Repositories
{
    public class EventRepository : MongoRepository<BsonDocument>
    {
        public EventRepository(MongoClient mongoClient) : base(mongoClient, "events")
        {
        }

        public async Task<List<Event>> GetEvents()
        {
            var bsonEvents = await GetAll();
            var events = bsonEvents.Select(be => ConvertBsonToObject(be)).ToList();
            return events;
        }

        private static Event ConvertBsonToObject(BsonDocument be)
        {
            var _event = new Event(
                id: be["_id"].AsObjectId.ToString(),
                organizationId: "gik",
                title: be["title"].AsString,
                date: be["date"].ToUniversalTime(),
                address: be["address"].AsString,
                link: be.Elements.Any(e => e.Name == "link") ? be["link"].AsString : null,
                disciplines: be["disciplines"].AsBsonArray
                    .Select(v => new EventDiscipline(
                        v["ageGroup"].AsString,
                        v["disciplines"].AsBsonArray
                            .Select(vi => new Discipline(
                                vi["id"].BsonType == BsonType.String ? vi["id"].AsString : null,
                                vi["name"].AsString
                                )
                            ).ToList()
                        )
                    ).ToList(),
                registrationPeriodStartDate: be["registrationPeriodStartDate"].ToUniversalTime(),
                registrationPeriodEndDate: be["registrationPeriodEndDate"].ToUniversalTime(),
                info: be.Elements.Any(e => e.Name == "info") ? be["info"].AsString : null
            );

            return _event;
        }
    }
}
