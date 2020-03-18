using System;
using System.Linq.Expressions;

namespace MyAthleticsClub.Api.Domain.Entities
{
    public class Member
    {
        private Member()
        {
            Id = Guid.NewGuid().ToString();
            IsActive = true;
        }

        public Member(string name) : this()
        {
            Name = name;
        }

        public string Id { get; private set; }

        public string Name { get; private set; } = null!;

        public bool IsActive { get; private set; }

        public static Expression<Func<Member, bool>> IsActiveExpr = m => m.IsActive;
    }
}