using System;

namespace SkillSwap.Application.Common.Utils;

public static class GeoCalculator
{
    /// <summary>
    /// Calculates the great-circle distance in kilometers between two points on the Earth's surface.
    /// Uses the mathematically rigorous Haversine formula.
    /// </summary>
    public static double CalculateDistanceInKilometers(double lat1, double lon1, double lat2, double lon2)
    {
        const double EarthRadiusKm = 6371.0;
        
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Asin(Math.Min(1.0, Math.Sqrt(a)));
        return EarthRadiusKm * c;
    }

    private static double ToRadians(double val)
    {
        return (Math.PI / 180.0) * val;
    }
}
