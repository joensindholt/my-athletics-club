namespace MyAthleticsClub.Api.Application.Features.Members.DataTansferObjects
{
    public class MemberDto
    {
        public MemberDto(string id, string name)
        {
            Id = id;
            Name = name;
        }

        public string Id { get; set; }

        public string Name { get; set; }
    }
}