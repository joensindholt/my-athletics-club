using System;
using System.Linq.Expressions;

namespace MyAthleticsClub.Api.Domain.Entities
{
    public class Member
    {
        public static Expression<Func<Member, bool>> IsActiveExpr = m => m.IsActive;

        public string Id { get; set; }

        public string Name { get; set; }

        public bool IsActive { get; set; }
    }
}