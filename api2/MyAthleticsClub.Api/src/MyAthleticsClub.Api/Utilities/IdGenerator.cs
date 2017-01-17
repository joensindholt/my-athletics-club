using System;

namespace MyAthleticsClub.Api.Utilities
{
    public class IdGenerator : IIdGenerator
    {
        // from here: http://madskristensen.net/post/generate-unique-strings-and-numbers-in-c
        public string GenerateId()
        {
            long i = 1;

            foreach (byte b in Guid.NewGuid().ToByteArray())
            {
                i *= ((int)b + 1);
            }

            return string.Format("{0:x}", i - DateTime.Now.Ticks);
        }
    }
}