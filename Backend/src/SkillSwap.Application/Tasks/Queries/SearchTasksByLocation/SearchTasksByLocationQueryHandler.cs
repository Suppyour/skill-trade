using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Common.Interfaces;

namespace SkillSwap.Application.Tasks.Queries.SearchTasksByLocation;

public class SearchTasksByLocationQueryHandler : IRequestHandler<SearchTasksByLocationQuery, IReadOnlyList<TaskLookupDto>>
{
    private readonly IGeoSearchService _geoSearchService;

    public SearchTasksByLocationQueryHandler(IGeoSearchService geoSearchService)
    {
        _geoSearchService = geoSearchService;
    }

    public async Task<IReadOnlyList<TaskLookupDto>> Handle(SearchTasksByLocationQuery request, CancellationToken cancellationToken)
    {
        return await _geoSearchService.SearchNearbyTasksAsync(
            request.Latitude,
            request.Longitude,
            request.RadiusInMeters,
            cancellationToken
        );
    }
}
