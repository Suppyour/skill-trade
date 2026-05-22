using System;

namespace SkillSwap.Application.Common.Exceptions;

public class SpatialVelocityAnomalyException : Exception
{
    public double DistanceInKm { get; }
    public double HoursElapsed { get; }

    public SpatialVelocityAnomalyException(double distanceInKm, double hoursElapsed)
        : base("Волшебника не проведешь! Магия телепортации запрещена Уставом Гильдии! 🧙‍♂️")
    {
        DistanceInKm = distanceInKm;
        HoursElapsed = hoursElapsed;
    }
}
