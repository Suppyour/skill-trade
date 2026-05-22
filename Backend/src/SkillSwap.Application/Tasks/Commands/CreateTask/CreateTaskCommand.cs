using System;
using MediatR;

namespace SkillSwap.Application.Tasks.Commands.CreateTask;

public record CreateTaskCommand(
    string Title,
    string Description,
    decimal PriceAmount,
    string Currency,
    double Latitude,
    double Longitude,
    Guid CreatorId
) : IRequest<Guid>;
