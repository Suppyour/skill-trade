using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using SkillSwap.Application.Common.Interfaces;
using SkillSwap.Application.Tasks.Queries.SearchTasksByLocation;

namespace SkillSwap.Infrastructure.Spatial;

public class PostGisGeoSearchService : IGeoSearchService
{
    private readonly ISkillSwapDbContext _context;
    private readonly GeometryFactory _geometryFactory = new(new PrecisionModel(), 4326);

    public PostGisGeoSearchService(ISkillSwapDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<TaskLookupDto>> SearchNearbyTasksAsync(
        double latitude,
        double longitude,
        double radiusInMeters,
        CancellationToken cancellationToken = default)
    {
        // Создаем точку пользователя. В NTS Point принимает (X, Y) -> (Longitude, Latitude)
        var userLocation = _geometryFactory.CreatePoint(new Coordinate(longitude, latitude));

        // Выполняем высокопроизводительный гео-запрос с использованием пространственного индекса в PostGIS.
        // NTS метод .IsWithinDistance транслируется в SQL функцию ST_DWithin на стороне PostgreSQL.
        var tasks = await _context.Tasks
            .AsNoTracking()
            .Where(t => t.Status == Domain.Aggregates.TaskAggregate.TaskStatus.Active)
            .Where(t => t.LocationPoint.IsWithinDistance(userLocation, radiusInMeters))
            .Select(t => new TaskLookupDto
            {
                Id = t.Id,
                Title = t.Title,
                Price = t.Price.Amount,
                Currency = t.Price.Currency,
                Latitude = t.Location.Latitude,
                Longitude = t.Location.Longitude,
                DistanceInMeters = t.LocationPoint.Distance(userLocation) // ST_Distance
            })
            .OrderBy(t => t.DistanceInMeters)
            .ToListAsync(cancellationToken);

        return tasks;
    }
}
