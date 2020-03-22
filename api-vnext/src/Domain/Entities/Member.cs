using System;
using System.Linq.Expressions;
using MyAthleticsClub.Api.Domain.Common;

namespace MyAthleticsClub.Api.Domain.Entities
{
    public class Member : AggregateRoot
    {
        private Member() : base()
        {
            IsActive = true;
        }

        public Member(string name) : this()
        {
            Name = name;
        }

        public string Name { get; private set; } = null!;

        public bool IsActive { get; private set; }

        public static Expression<Func<Member, bool>> IsActiveExpr = m => m.IsActive;

        /// <summary>
        /// Update the name of the member.
        /// A setter on member is avoid to make sure we can do business logic when a members name change
        /// Eg. firing an event, logging it etc.
        /// </summary>
        public void UpdateName(string name)
        {
            Name = name;
        }
    }
}