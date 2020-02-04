using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace MyAthleticsClub.Server.Models
{
    public class Member : TableEntity
    {
        public Member()
        {
            PartitionKey = "gik";
        }

        public Guid Id
        {
            get { return Guid.Parse(RowKey); }
            set { RowKey = value.ToString(); }
        }
    }
}


