using System;

namespace MyAthleticsClub.Core.Shared.Exceptions
{
    /// <summary>
    /// BadRequestException is used to signal when an invalid request has been made to the Core layer.
    /// It is no the same as the http BadRequest term although api controllers returns a BadRequest when catching
    /// this exception
    /// </summary>
    public class BadRequestException : Exception
    {
        public BadRequestException(string message) : base(message)
        {
        }
    }
}
