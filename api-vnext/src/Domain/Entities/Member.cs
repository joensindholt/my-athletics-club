using System;
using System.Linq.Expressions;

namespace MyAthleticsClub.Api.Domain.Entities
{
    public class Member
    {
        private Member()
        {
            Id = Guid.NewGuid().ToString();
        }

        public Member(string name) : this()
        {
            Name = name;
        }

        public string Id { get; set; }

        public string Name { get; set; }

        public bool IsActive { get; set; }

        public static Expression<Func<Member, bool>> IsActiveExpr = m => m.IsActive;
    }
}