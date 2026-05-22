using System;
using System.Collections.Generic;
using SkillSwap.Domain.Common;

namespace SkillSwap.Domain.ValueObjects;

public class Money : ValueObject
{
    public decimal Amount { get; }
    public string Currency { get; }

#pragma warning disable CS8618 // Required for Entity Framework Core
    private Money() { }
#pragma warning restore CS8618

    public Money(decimal amount, string currency)
    {
        if (amount < 0)
            throw new ArgumentException("Сумма не может быть отрицательной.", nameof(amount));
        if (string.IsNullOrWhiteSpace(currency))
            throw new ArgumentException("Валюта должна быть указана.", nameof(currency));

        Amount = amount;
        Currency = currency.ToUpperInvariant();
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Amount;
        yield return Currency;
    }
}
