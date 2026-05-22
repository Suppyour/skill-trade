using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Task = SkillSwap.Domain.Aggregates.TaskAggregate.Task;

namespace SkillSwap.Infrastructure.Persistence.Configurations;

public class TaskConfiguration : IEntityTypeConfiguration<Task>
{
    public void Configure(EntityTypeBuilder<Task> builder)
    {
        builder.ToTable("Tasks");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(2000);

        // Настройка owned Value Object - Price (Money)
        builder.OwnsOne(t => t.Price, price =>
        {
            price.Property(p => p.Amount)
                .HasColumnName("PriceAmount")
                .HasColumnType("numeric(18,2)")
                .IsRequired();

            price.Property(p => p.Currency)
                .HasColumnName("PriceCurrency")
                .HasMaxLength(3)
                .IsRequired();
        });

        // Настройка owned Value Object - Location (Latitude/Longitude)
        builder.OwnsOne(t => t.Location, loc =>
        {
            loc.Property(l => l.Latitude)
                .HasColumnName("Latitude")
                .IsRequired();

            loc.Property(l => l.Longitude)
                .HasColumnName("Longitude")
                .IsRequired();
        });

        // Настройка свойства Point для PostGIS запросов и индексации
        builder.Property(t => t.LocationPoint)
            .HasColumnName("LocationPoint")
            .HasColumnType("geometry(Point, 4326)")
            .IsRequired();

        builder.Property(t => t.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(t => t.CreatorId)
            .IsRequired();

        builder.Property(t => t.ExecutorId);

        builder.Property(t => t.CreatedAt)
            .IsRequired();
    }
}
