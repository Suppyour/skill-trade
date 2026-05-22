using System;
using System.Collections.Generic;
using SkillSwap.Domain.Common;

namespace SkillSwap.Domain.ValueObjects;

public class Location : ValueObject
{
    public double Latitude { get; }
    public double Longitude { get; }

    private Location() { } // Required for Entity Framework Core

    public Location(double latitude, double longitude)
    {
        if (latitude is < -90 or > 90)
            throw new ArgumentOutOfRangeException(nameof(latitude), "Широта должна быть между -90 и 90 градусами.");
        if (longitude is < -180 or > 180)
            throw new ArgumentOutOfRangeException(nameof(longitude), "Долгота должна быть между -180 и 180 градусами.");

        Latitude = latitude;
        Longitude = longitude;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Latitude;
        yield return Longitude;
    }
}
