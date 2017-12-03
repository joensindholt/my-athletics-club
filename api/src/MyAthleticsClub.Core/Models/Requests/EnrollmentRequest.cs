using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyAthleticsClub.Core.Models.Requests
{
    /// <summary>
    /// EnrollmentRequest contains the properties having to be supplied when enrolling as a new member
    /// </summary>
    public class EnrollmentRequest
    {
        [Required]
        public string MembershipType { get; set; }

        [Required]
        [RegularExpression(".+@.+\\..+", ErrorMessage = "The email address is invalid")]
        public string Email { get; set; }

        [Required]
        public List<EnrollmentRequestMember> Members { get; set; }

        [Required]
        public string Comments { get; set; }
    }

    public class EnrollmentRequestMember
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [RegularExpression("\\d{2}-\\d{2}-\\d{4}", ErrorMessage = "The birthdate is not in the required dd-mm-yyyy format")]
        public string BirthDate { get; set; }
    }
}
