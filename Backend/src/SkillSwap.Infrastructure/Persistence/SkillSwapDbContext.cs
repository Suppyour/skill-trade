using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SkillSwap.Application.Common.Interfaces;

namespace SkillSwap.Infrastructure.Persistence;

public class SkillSwapDbContext : DbContext, ISkillSwapDbContext
{
    public DbSet<Domain.Aggregates.TaskAggregate.Task> Tasks => Set<Domain.Aggregates.TaskAggregate.Task>();

    public SkillSwapDbContext(DbContextOptions<SkillSwapDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Автоматически применяем все конфигурации интерфейса IEntityTypeConfiguration из инфраструктуры
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }
}
