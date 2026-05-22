using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Common.Interfaces;
using SkillSwap.Domain.Aggregates.TaskAggregate;
using SkillSwap.Domain.ValueObjects;

namespace SkillSwap.Application.Tasks.Commands.CreateTask;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, Guid>
{
    private readonly ISkillSwapDbContext _context;

    public CreateTaskCommandHandler(ISkillSwapDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        // 1. Создаем Value Objects
        var price = new Money(request.PriceAmount, request.Currency);
        var location = new Location(request.Latitude, request.Longitude);

        // 2. Создаем Aggregate Root с помощью фабричного метода
        var task = Domain.Aggregates.TaskAggregate.Task.Create(
            request.Title,
            request.Description,
            price,
            location,
            request.CreatorId
        );

        // 3. Добавляем в контекст
        await _context.Tasks.AddAsync(task, cancellationToken);
        
        // 4. Фиксируем транзакцию
        await _context.SaveChangesAsync(cancellationToken);

        // 5. Возвращаем сгенерированный ID
        return task.Id;
    }
}
