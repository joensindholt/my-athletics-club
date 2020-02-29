namespace MyAthleticsClub.Api.Application.Features.Members.CreateMember
{
    public class CreateMemberResponse
    {
        public CreateMemberResponse(string id)
        {
            Id = id;
        }

        public string Id { get; }
    }
}