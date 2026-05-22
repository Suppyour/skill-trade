using FluentValidation;

namespace SkillSwap.Application.Tasks.Commands.CreateTask;

public class CreateTaskCommandValidator : AbstractValidator<CreateTaskCommand>
{
    public CreateTaskCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Название задачи обязательно.")
            .MaximumLength(150).WithMessage("Название не может превышать 150 символов.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Описание задачи обязательно.")
            .MinimumLength(20).WithMessage("Описание должно быть не менее 20 символов.");

        RuleFor(x => x.PriceAmount)
            .GreaterThan(0).WithMessage("Цена должна быть больше нуля.");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Валюта обязательна.")
            .Length(3).WithMessage("Код валюты должен состоять из 3-х символов (ISO).");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("Широта должна быть в пределах от -90 до 90 градусов.");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("Долгота должна быть в пределах от -180 до 180 градусов.");

        RuleFor(x => x.CreatorId)
            .NotEmpty().WithMessage("Идентификатор создателя задачи обязателен.");
    }
}
