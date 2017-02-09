using System;

namespace MyAthleticsClub.Core.Utilities
{
    public static class VerifyExtensions
    {
        public static void VerifyNotNullOrWhiteSpace(this string value, string paramName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Value must not be null or whitespace", paramName);
            }
        }

        public static void VerifyNotNull(this object value, string paramName)
        {
            if (value == null)
            {
                throw new ArgumentNullException(paramName, "Value must not be null");
            }
        }
    }
}