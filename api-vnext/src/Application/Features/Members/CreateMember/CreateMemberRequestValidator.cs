using FluentValidation;

namespace MyAthleticsClub.Api.Application.Features.Members.CreateMember
{
    public class CreateMemberRequestValidator : AbstractValidator<CreateMemberRequest>
    {
        public CreateMemberRequestValidator()
        {
            RuleFor(m => m.Name)
                .NotEmpty().WithMessage("Name is required");
        }
    }
}
