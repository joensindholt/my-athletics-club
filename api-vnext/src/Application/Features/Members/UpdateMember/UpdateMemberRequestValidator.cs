using FluentValidation;

namespace MyAthleticsClub.Api.Application.Features.Members.UpdateMember
{
    public class UpdateMemberRequestValidator : AbstractValidator<UpdateMemberRequest>
    {
        public UpdateMemberRequestValidator()
        {
            RuleFor(m => m.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(m => m.Name)
                .NotEmpty().WithMessage("Name is required");
        }
    }
}
