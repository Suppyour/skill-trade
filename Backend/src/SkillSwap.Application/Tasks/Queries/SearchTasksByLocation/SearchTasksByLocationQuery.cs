using System.Collections.Generic;
using MediatR;

namespace SkillSwap.Application.Tasks.Queries.SearchTasksByLocation;

public record SearchTasksByLocationQuery(
    double Latitude,
    double Longitude,
    double RadiusInMeters
) : IRequest<IReadOnlyList<TaskLookupDto>>;
