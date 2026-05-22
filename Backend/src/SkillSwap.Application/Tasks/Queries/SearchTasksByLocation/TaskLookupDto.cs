using System;

namespace SkillSwap.Application.Tasks.Queries.SearchTasksByLocation;

public class TaskLookupDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public decimal Price { get; set; }
    public string Currency { get; set; } = null!;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double DistanceInMeters { get; set; }
}
