using System;
using MediatR;

namespace SkillSwap.Application.Tasks.Commands.CreateTask;

public record TaskCreatedNotification(
    Guid TaskId,
    string Title,
    string Description,
    double Latitude,
    double Longitude,
    decimal PriceAmount,
    string Currency,
    Guid CreatorId,
    DateTime CreatedAt
) : INotification;
