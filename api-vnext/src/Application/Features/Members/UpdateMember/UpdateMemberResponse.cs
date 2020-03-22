namespace MyAthleticsClub.Api.Application.Features.Members.UpdateMember
{
    public class UpdateMemberResponse
    {
        public UpdateMemberResponse(string id, string name)
        {
            Id = id;
            Name = name;
        }

        public string Id { get; }

        public string Name { get; }
    }
}