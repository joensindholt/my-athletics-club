using Newtonsoft.Json;

namespace MyAthleticsClub.Api.Users
{
    /// <summary>
    /// https://developers.google.com/identity/sign-in/web/backend-auth
    /// </summary>
    public class GoogleTokenClaims
    {
        /// <summary>
        /// https://accounts.google.com
        /// </summary>
        public string Iss { get; set; }

        /// <summary>
        /// 110169484474386276334
        /// </summary>
        public string Sub { get; set; }

        /// <summary>
        /// 1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com
        /// </summary>
        public string Azp { get; set; }

        /// <summary>
        /// 1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com
        /// </summary>
        public string Aud { get; set; }

        /// <summary>
        /// 1433978353
        /// </summary>
        public string Iat { get; set; }

        /// <summary>
        /// 1433981953
        /// </summary>
        public string Exp { get; set; }

        /// <summary>
        /// testuser@gmail.com
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// true
        /// </summary>
        [JsonProperty("email_verified")]
        public string EmailVerified { get; set; }

        /// <summary>
        /// Test User
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// https://lh4.googleusercontent.com/-kYgzyAWpZzJ/ABCDEFGHI/AAAJKLMNOP/tIXL9Ir44LE/s99-c/photo.jpg
        /// </summary>
        public string Picture { get; set; }

        /// <summary>
        /// Test
        /// </summary>
        [JsonProperty("given_name")]
        public string GivenName { get; set; }

        /// <summary>
        /// User
        /// </summary>
        [JsonProperty("family_name")]
        public string FamilyName { get; set; }

        /// <summary>
        /// en
        /// </summary>
        public string Locale { get; set; }
    }
}
