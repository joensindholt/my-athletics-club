using System;
using System.Linq.Expressions;

namespace MyAthleticsClub.Api.Domain.Entities
{
    public class Member
    {
        public static Expression<Func<Member, bool>> IsActive = m => m.Name.StartsWith("John");

        public string Name { get; set; }
    }
}