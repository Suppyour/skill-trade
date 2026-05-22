using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SkillSwap.Application.Common.Interfaces;
using SkillSwap.Application.Common.Utils;
using SkillSwap.Application.Tasks.Queries.SearchTasksByLocation;

namespace SkillSwap.Infrastructure.Spatial;

public class PostGisGeoSearchService : IGeoSearchService
{
    private readonly ISkillSwapDbContext _context;

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
        // 1. Высокопроизводительный фильтр по Bounding Box (ограничивающей рамке) на стороне БД.
        // 1 градус широты ~ 111 000 метров.
        double latDelta = radiusInMeters / 111000.0;
        // 1 градус долготы ~ 111 000 * cos(lat) метров.
        double latRad = latitude * Math.PI / 180.0;
        double cosLat = Math.Cos(latRad);
        double lonDelta = cosLat > 0.01 
            ? radiusInMeters / (111000.0 * cosLat) 
            : 360.0; // На полюсах охватываем все долготы

        double minLat = latitude - latDelta;
        double maxLat = latitude + latDelta;
        double minLon = longitude - lonDelta;
        double maxLon = longitude + lonDelta;

        // Фильтруем квесты по рамке (Bounding Box) с использованием числовых индексов БД
        var activeTasks = await _context.Tasks
            .AsNoTracking()
            .Where(t => t.Status == Domain.Aggregates.TaskAggregate.TaskStatus.Active)
            .Where(t => t.Location.Latitude >= minLat && t.Location.Latitude <= maxLat &&
                        t.Location.Longitude >= minLon && t.Location.Longitude <= maxLon)
            .ToListAsync(cancellationToken);

        // 2. В памяти вычисляем точное расстояние по формуле Гаверсинуса (до метра) и фильтруем по круговому радиусу
        var tasks = activeTasks
            .Select(t =>
            {
                var distanceInKm = GeoCalculator.CalculateDistanceInKilometers(
                    latitude,
                    longitude,
                    t.Location.Latitude,
                    t.Location.Longitude
                );

                return new TaskLookupDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Price = t.Price.Amount,
                    Currency = t.Price.Currency,
                    Latitude = t.Location.Latitude,
                    Longitude = t.Location.Longitude,
                    DistanceInMeters = distanceInKm * 1000
                };
            })
            .Where(t => t.DistanceInMeters <= radiusInMeters)
            .OrderBy(t => t.DistanceInMeters)
            .ToList();

        return tasks;
    }
}
