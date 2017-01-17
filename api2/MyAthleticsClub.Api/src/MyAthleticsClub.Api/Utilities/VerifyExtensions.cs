using System;

namespace MyAthleticsClub.Api.Utilities
{
    public static class VerifyExtensions
    {
        public static void VerifyNotNullOrWhiteSpace(this string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new Exception("Value must not be null or whitespace");
            }
        }
    }
}