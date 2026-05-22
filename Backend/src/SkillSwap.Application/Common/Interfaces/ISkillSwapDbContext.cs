using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SkillSwap.Application.Common.Interfaces;

public interface ISkillSwapDbContext
{
    DbSet<Domain.Aggregates.TaskAggregate.Task> Tasks { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
