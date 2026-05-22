using System;
using Point = NetTopologySuite.Geometries.Point;
using SkillSwap.Domain.Common;
using SkillSwap.Domain.ValueObjects;

namespace SkillSwap.Domain.Aggregates.TaskAggregate;

public class Task : AggregateRoot
{
    public string Title { get; private set; } = null!;
    public string Description { get; private set; } = null!;
    public Money Price { get; private set; } = null!;
    public Location Location { get; private set; } = null!;
    
    // Свойство NetTopologySuite Point, которое EF Core использует для гео-запросов и маппинга
    public Point LocationPoint { get; private set; } = null!;
    
    public TaskStatus Status { get; private set; }
    public Guid CreatorId { get; private set; }
    public Guid? ExecutorId { get; private set; }
    public DateTime CreatedAt { get; private set; }

#pragma warning disable CS8618 // Required for EF Core deserialization
    private Task() { }
#pragma warning restore CS8618

    // Фабричный метод для инкапсулированного создания
    public static Task Create(string title, string description, Money price, Location location, Guid creatorId)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Название задачи не может быть пустым.", nameof(title));
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Описание задачи не может быть пустым.", nameof(description));
        if (price == null)
            throw new ArgumentNullException(nameof(price));
        if (location == null)
            throw new ArgumentNullException(nameof(location));
        if (creatorId == Guid.Empty)
            throw new ArgumentException("Идентификатор создателя задачи обязателен.", nameof(creatorId));

        var ntsPoint = new Point(location.Longitude, location.Latitude) { SRID = 4326 };

        return new Task
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description,
            Price = price,
            Location = location,
            LocationPoint = ntsPoint,
            Status = TaskStatus.Active,
            CreatorId = creatorId,
            CreatedAt = DateTime.UtcNow
        };
    }

    // Бизнес-метод для назначения исполнителя
    public void AssignExecutor(Guid executorId)
    {
        if (Status != TaskStatus.Active)
            throw new InvalidOperationException("Исполнитель может быть назначен только на активную задачу.");
        if (CreatorId == executorId)
            throw new InvalidOperationException("Создатель задачи не может быть её исполнителем.");
        if (executorId == Guid.Empty)
            throw new ArgumentException("Идентификатор исполнителя обязателен.", nameof(executorId));

        ExecutorId = executorId;
        Status = TaskStatus.InProgress;
    }

    // Бизнес-метод завершения задачи
    public void Complete()
    {
        if (Status != TaskStatus.InProgress)
            throw new InvalidOperationException("Завершить можно только задачу, которая находится в процессе выполнения.");

        Status = TaskStatus.Completed;
    }

    // Бизнес-метод отмены задачи
    public void Cancel()
    {
        if (Status is TaskStatus.Completed or TaskStatus.Cancelled)
            throw new InvalidOperationException("Нельзя отменить уже завершенную или отмененную задачу.");

        Status = TaskStatus.Cancelled;
    }
}
