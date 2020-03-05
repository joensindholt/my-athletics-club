using System;

namespace MyAthleticsClub.Core.Options
{
    public class StorageOptions
    {
        public bool? CreateTables { get; set; }

        public void Verify()
        {
            if (!CreateTables.HasValue)
            {
                throw new ArgumentException("Missing option", nameof(CreateTables));
            }
        }
    }
}
