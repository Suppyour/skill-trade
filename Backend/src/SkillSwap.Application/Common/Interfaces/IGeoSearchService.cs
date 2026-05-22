using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SkillSwap.Application.Tasks.Queries.SearchTasksByLocation;

namespace SkillSwap.Application.Common.Interfaces;

public interface IGeoSearchService
{
    Task<IReadOnlyList<TaskLookupDto>> SearchNearbyTasksAsync(
        double latitude,
        double longitude,
        double radiusInMeters,
        CancellationToken cancellationToken = default);
}
