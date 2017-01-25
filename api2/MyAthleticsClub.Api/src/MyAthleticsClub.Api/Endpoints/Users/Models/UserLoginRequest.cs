using System.ComponentModel.DataAnnotations;

namespace MyAthleticsClub.Api.Users
{
    public class UserLoginRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}