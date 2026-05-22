using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillSwap.Application.Common.Exceptions;
using SkillSwap.Application.Common.Interfaces;
using SkillSwap.Application.Common.Utils;
using SkillSwap.Domain.Aggregates.TaskAggregate;
using SkillSwap.Domain.ValueObjects;

namespace SkillSwap.Application.Tasks.Commands.CreateTask;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, Guid>
{
    private readonly ISkillSwapDbContext _context;
    private readonly IMediator _mediator;

    public CreateTaskCommandHandler(ISkillSwapDbContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    public async Task<Guid> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        // 0. Географический анти-фрод (Spatial Velocity Anomaly Detection)
        // Ищем последнюю опубликованную задачу данного пользователя
        var lastTask = await _context.Tasks
            .Where(t => t.CreatorId == request.CreatorId)
            .OrderByDescending(t => t.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (lastTask != null)
        {
            var distance = GeoCalculator.CalculateDistanceInKilometers(
                lastTask.Location.Latitude, 
                lastTask.Location.Longitude, 
                request.Latitude, 
                request.Longitude
            );

            var timeElapsed = DateTime.UtcNow - lastTask.CreatedAt;
            var hoursElapsed = timeElapsed.TotalHours;

            // Если задачи разнесены в пространстве, проверяем физическую скорость
            if (distance > 0.1) // Свыше 100 метров
            {
                // Защита от деления на 0 при мгновенных повторных кликах
                if (hoursElapsed < 0.0002) // Менее 0.72 секунды
                {
                    throw new SpatialVelocityAnomalyException(distance, hoursElapsed);
                }

                var velocity = distance / hoursElapsed;

                // Лимит движения в JRPG-вселенной: 800 км/ч (скорость полета дракона / авиалайнера)
                if (velocity > 800.0)
                {
                    throw new SpatialVelocityAnomalyException(distance, hoursElapsed);
                }
            }
        }

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

        // 4.5. Публикуем событие через MediatR
        await _mediator.Publish(new TaskCreatedNotification(
            task.Id,
            task.Title,
            task.Description,
            task.Location.Latitude,
            task.Location.Longitude,
            task.Price.Amount,
            task.Price.Currency,
            task.CreatorId,
            task.CreatedAt
        ), cancellationToken);

        // 5. Возвращаем сгенерированный ID
        return task.Id;
    }
}
