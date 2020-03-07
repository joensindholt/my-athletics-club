using System;
using System.Linq.Expressions;

namespace MyAthleticsClub.Api.Domain.Entities
{
    public class Member
    {
        public Member(string name)
        {
            Id = Guid.NewGuid().ToString();
            Name = name;
        }

        public string Id { get; private set; }

        public string Name { get; private set; }

        public bool IsActive { get; private set; }

        public static Expression<Func<Member, bool>> IsActiveExpr = m => m.IsActive;
    }
}