using System;

namespace MyAthleticsClub.Api.Domain.Common
{
    public abstract class AggregateRoot
    {
        public AggregateRoot()
        {
            Id = Guid.NewGuid().ToString();
        }

        public string Id { get; protected set; }
    }
}