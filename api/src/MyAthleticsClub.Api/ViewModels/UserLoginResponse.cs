﻿namespace MyAthleticsClub.Api.Endpoints.Users
{
    public class UserLoginResponse
    {
        public string Token { get; private set; }

        public UserLoginResponse(string token)
        {
            Token = token;
        }
    }
}