using System.ComponentModel.DataAnnotations;

namespace MyAthleticsClub.Api.Endpoints.Users
{
    public class UserLoginRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}