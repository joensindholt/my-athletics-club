using Newtonsoft.Json;

namespace MyAthleticsClub.Api.Users
{
    public class LoginResponse
    {
        public string Username { get; }

        [JsonProperty("access_token")]
        public string AccessToken { get; }

        /// <summary>
        /// The expiration time as unix epoch time
        /// </summary>
        public long Expires { get; }

        public LoginResponse(string username, string accessToken, long unixEpochExpirationDate)
        {
            Username = username;
            AccessToken = accessToken;
            Expires = unixEpochExpirationDate;
        }
    }
}
