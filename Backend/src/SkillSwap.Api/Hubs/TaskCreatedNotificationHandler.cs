using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using SkillSwap.Application.Tasks.Commands.CreateTask;

namespace SkillSwap.Api.Hubs;

public class TaskCreatedNotificationHandler : INotificationHandler<TaskCreatedNotification>
{
    private readonly IHubContext<TaskHub> _hubContext;

    public TaskCreatedNotificationHandler(IHubContext<TaskHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task Handle(TaskCreatedNotification notification, CancellationToken cancellationToken)
    {
        // Broadcast the new task event to all connected SignalR clients
        await _hubContext.Clients.All.SendAsync("OnTaskCreated", new
        {
            taskId = notification.TaskId,
            title = notification.Title,
            description = notification.Description,
            latitude = notification.Latitude,
            longitude = notification.Longitude,
            priceAmount = notification.PriceAmount,
            currency = notification.Currency,
            creatorId = notification.CreatorId,
            createdAt = notification.CreatedAt
        }, cancellationToken);
    }
}
