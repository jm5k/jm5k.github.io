(function (root) {
    "use strict";

    const NANOSECONDS_PER_SECOND = 1000000000n;
    const NANOSECONDS_PER_DAY = 86400n * NANOSECONDS_PER_SECOND;
    const SECONDS_PER_DAY = 86400;
    const MAX_DECIMAL_EXPONENT = 1000;

    const units = Object.freeze([
        ["nanoseconds", 1n, false],
        ["microseconds", 1000n, false],
        ["milliseconds", 1000000n, false],
        ["seconds", NANOSECONDS_PER_SECOND, false],
        ["minutes", 60n * NANOSECONDS_PER_SECOND, false],
        ["hours", 3600n * NANOSECONDS_PER_SECOND, false],
        ["days", NANOSECONDS_PER_DAY, false],
        ["weeks", 7n * NANOSECONDS_PER_DAY, false],
        ["months", 2629746n * NANOSECONDS_PER_SECOND, true],
        ["years", 31556952n * NANOSECONDS_PER_SECOND, true],
        ["decades", 315569520n * NANOSECONDS_PER_SECOND, true]
    ].map(([id, nanoseconds, averageGregorian]) => Object.freeze({
        id,
        label: id,
        nanoseconds,
        averageGregorian
    })));

    const UNIT_MAP = Object.freeze(Object.fromEntries(
        units.map((unit) => [unit.id, unit])
    ));

    function requireUnit(unit) {
        if (!Object.prototype.hasOwnProperty.call(UNIT_MAP, unit)) {
            throw new RangeError(`Unsupported duration unit: ${unit}`);
        }
        return UNIT_MAP[unit];
    }

    function requireNonNegativeNumber(value, label) {
        if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
            throw new RangeError(`${label} must be a finite, non-negative number`);
        }
        return value;
    }

    function requireTimeOfDay(value, label) {
        requireNonNegativeNumber(value, label);
        if (value >= SECONDS_PER_DAY) {
            throw new RangeError(`${label} must be less than 86400 seconds`);
        }
        return value;
    }

    function greatestCommonDivisor(first, second) {
        let a = first < 0n ? -first : first;
        let b = second < 0n ? -second : second;
        while (b) {
            const remainder = a % b;
            a = b;
            b = remainder;
        }
        return a || 1n;
    }

    function reduceFraction(numerator, denominator) {
        const divisor = greatestCommonDivisor(numerator, denominator);
        return {
            numerator: numerator / divisor,
            denominator: denominator / divisor
        };
    }

    function parseDecimal(value, label) {
        let text;
        let inputPrecisionLimited = false;

        if (typeof value === "number") {
            requireNonNegativeNumber(value, label);
            inputPrecisionLimited =
                Number.isInteger(value) && !Number.isSafeInteger(value);
            text = String(value);
        } else if (typeof value === "bigint") {
            if (value < 0n) {
                throw new RangeError(`${label} must be non-negative`);
            }
            text = String(value);
        } else if (typeof value === "string") {
            text = value.trim();
        } else {
            throw new RangeError(`${label} must be a finite, non-negative number`);
        }

        if (text.startsWith("-")) {
            throw new RangeError(`${label} must be non-negative`);
        }

        const match = text.match(
            /^\+?(\d+)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/
        );
        if (!match) {
            throw new RangeError(`${label} must be a finite, non-negative number`);
        }

        const exponent = Number(match[3] || 0);
        if (
            !Number.isInteger(exponent) ||
            Math.abs(exponent) > MAX_DECIMAL_EXPONENT
        ) {
            throw new RangeError(`${label} is outside the supported practical range`);
        }

        const fractionDigits = match[2] || "";
        const digits = `${match[1]}${fractionDigits}`.replace(/^0+(?=\d)/, "");
        let numerator = BigInt(digits || "0");
        let denominator = 1n;
        const scale = fractionDigits.length - exponent;

        if (scale > 0) denominator = 10n ** BigInt(scale);
        else if (scale < 0) numerator *= 10n ** BigInt(-scale);

        return {
            ...reduceFraction(numerator, denominator),
            inputPrecisionLimited
        };
    }

    function durationInNanoseconds(value, unit, label) {
        const parsed = parseDecimal(value, label);
        const definition = requireUnit(unit);
        return {
            ...reduceFraction(
                parsed.numerator * definition.nanoseconds,
                parsed.denominator
            ),
            inputPrecisionLimited: parsed.inputPrecisionLimited,
            approximate: definition.averageGregorian
        };
    }

    function groupInteger(value) {
        return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function roundDivide(numerator, denominator) {
        const quotient = numerator / denominator;
        const remainder = numerator % denominator;
        return remainder * 2n >= denominator ? quotient + 1n : quotient;
    }

    function finiteDecimalPlaces(denominator) {
        let value = denominator;
        let twos = 0;
        let fives = 0;
        while (value % 2n === 0n) {
            value /= 2n;
            twos += 1;
        }
        while (value % 5n === 0n) {
            value /= 5n;
            fives += 1;
        }
        return value === 1n ? Math.max(twos, fives) : null;
    }

    function scientificExponent(numerator, denominator) {
        let exponent = String(numerator).length - String(denominator).length;
        if (exponent >= 0) {
            if (numerator < denominator * 10n ** BigInt(exponent)) exponent -= 1;
        } else if (numerator * 10n ** BigInt(-exponent) < denominator) {
            exponent -= 1;
        }
        return exponent;
    }

    function formatScientific(numerator, denominator, exponent) {
        const significantDigits = 13;
        const scaleExponent = significantDigits - 1 - exponent;
        let scaled;
        let exact;

        if (scaleExponent >= 0) {
            const scaledNumerator = numerator * 10n ** BigInt(scaleExponent);
            scaled = roundDivide(scaledNumerator, denominator);
            exact = scaledNumerator % denominator === 0n;
        } else {
            const scaledDenominator =
                denominator * 10n ** BigInt(-scaleExponent);
            scaled = roundDivide(numerator, scaledDenominator);
            exact = numerator % scaledDenominator === 0n;
        }

        const limit = 10n ** BigInt(significantDigits);
        if (scaled >= limit) {
            scaled /= 10n;
            exponent += 1;
        }

        const digits = String(scaled).padStart(significantDigits, "0");
        const fraction = digits.slice(1).replace(/0+$/, "");
        return {
            text: `${digits[0]}${fraction ? `.${fraction}` : ""}e${
                exponent >= 0 ? "+" : ""
            }${exponent}`,
            rounded: !exact,
            scientific: true
        };
    }

    function formatFraction(numerator, denominator, maxFractionDigits = 12) {
        const reduced = reduceFraction(numerator, denominator);
        const top = reduced.numerator;
        const bottom = reduced.denominator;

        if (top === 0n) {
            return { text: "0", rounded: false, scientific: false };
        }

        const exponent = scientificExponent(top, bottom);
        if (exponent >= 21 || exponent <= -10) {
            return formatScientific(top, bottom, exponent);
        }

        if (top % bottom === 0n) {
            return {
                text: groupInteger(top / bottom),
                rounded: false,
                scientific: false
            };
        }

        const terminatingPlaces = finiteDecimalPlaces(bottom);
        const decimalPlaces =
            terminatingPlaces !== null && terminatingPlaces <= maxFractionDigits
                ? terminatingPlaces
                : maxFractionDigits;
        const scale = 10n ** BigInt(decimalPlaces);
        const scaledNumerator = top * scale;
        const scaled = roundDivide(scaledNumerator, bottom);
        const exact = scaledNumerator % bottom === 0n;
        const whole = scaled / scale;
        const fraction = String(scaled % scale)
            .padStart(decimalPlaces, "0")
            .replace(/0+$/, "");

        return {
            text: `${groupInteger(whole)}${fraction ? `.${fraction}` : ""}`,
            rounded: !exact,
            scientific: false
        };
    }

    function pluralized(valueNumerator, valueDenominator, singular) {
        return `${singular}${valueNumerator === valueDenominator ? "" : "s"}`;
    }

    function formatHumanNanoseconds(numerator, denominator) {
        if (numerator === 0n) return "0 seconds";

        let remaining = numerator;
        const parts = [];
        const largeUnits = [
            ["week", requireUnit("weeks").nanoseconds],
            ["day", requireUnit("days").nanoseconds],
            ["hour", requireUnit("hours").nanoseconds],
            ["minute", requireUnit("minutes").nanoseconds]
        ];

        for (const [label, unitNanoseconds] of largeUnits) {
            const divisor = denominator * unitNanoseconds;
            const value = remaining / divisor;
            if (value) {
                parts.push(`${groupInteger(value)} ${label}${value === 1n ? "" : "s"}`);
                remaining -= value * divisor;
            }
        }

        if (remaining) {
            const fixedUnits = [
                ["second", requireUnit("seconds").nanoseconds],
                ["millisecond", requireUnit("milliseconds").nanoseconds],
                ["microsecond", requireUnit("microseconds").nanoseconds],
                ["nanosecond", requireUnit("nanoseconds").nanoseconds]
            ];
            const selected = fixedUnits.find(
                ([, unitNanoseconds]) =>
                    remaining >= denominator * unitNanoseconds
            ) || fixedUnits[fixedUnits.length - 1];
            const value = reduceFraction(
                remaining,
                denominator * selected[1]
            );
            parts.push(
                `${formatFraction(value.numerator, value.denominator, 9).text} ${
                    pluralized(value.numerator, value.denominator, selected[0])
                }`
            );
        }

        return parts.join(" ");
    }

    function calculateIntervals(
        durationValue,
        durationUnit,
        intervalValue,
        intervalUnit
    ) {
        const duration = durationInNanoseconds(
            durationValue,
            durationUnit,
            "Duration"
        );
        const interval = durationInNanoseconds(
            intervalValue,
            intervalUnit,
            "Interval"
        );

        if (interval.numerator === 0n) {
            throw new RangeError("Interval must be greater than zero");
        }

        const exactFraction = reduceFraction(
            duration.numerator * interval.denominator,
            duration.denominator * interval.numerator
        );
        const complete = exactFraction.numerator / exactFraction.denominator;
        const remainder = reduceFraction(
            duration.numerator * interval.denominator -
                complete * interval.numerator * duration.denominator,
            duration.denominator * interval.denominator
        );
        const exactDisplay = formatFraction(
            exactFraction.numerator,
            exactFraction.denominator
        );

        return Object.freeze({
            completeIntervals: Number(complete),
            completeIntervalsExact: String(complete),
            completeIntervalsText: groupInteger(complete),
            remainderSeconds:
                Number(remainder.numerator) /
                Number(remainder.denominator) /
                Number(NANOSECONDS_PER_SECOND),
            remainderText: formatHumanNanoseconds(
                remainder.numerator,
                remainder.denominator
            ),
            exactIntervals:
                Number(exactFraction.numerator) /
                Number(exactFraction.denominator),
            exactIntervalsText: exactDisplay.text,
            roundedForDisplay: exactDisplay.rounded,
            approximate: duration.approximate || interval.approximate,
            inputPrecisionLimited:
                duration.inputPrecisionLimited ||
                interval.inputPrecisionLimited
        });
    }

    function durationBetweenTimes(startSeconds, endSeconds) {
        requireTimeOfDay(startSeconds, "Start time");
        requireTimeOfDay(endSeconds, "End time");

        return endSeconds >= startSeconds
            ? endSeconds - startSeconds
            : SECONDS_PER_DAY - startSeconds + endSeconds;
    }

    function shiftTime(startSeconds, durationValue, durationUnit, operation) {
        requireTimeOfDay(startSeconds, "Start time");
        const duration = durationInNanoseconds(
            durationValue,
            durationUnit,
            "Duration"
        );

        if (operation !== "add" && operation !== "subtract") {
            throw new RangeError('Operation must be "add" or "subtract"');
        }

        const startNanoseconds =
            BigInt(Math.round(startSeconds * Number(NANOSECONDS_PER_SECOND))) *
            duration.denominator;
        const shiftedNumerator = operation === "add"
            ? startNanoseconds + duration.numerator
            : startNanoseconds - duration.numerator;
        const dayDenominator = duration.denominator * NANOSECONDS_PER_DAY;
        let dayOffset = shiftedNumerator / dayDenominator;
        if (shiftedNumerator < 0n && shiftedNumerator % dayDenominator) {
            dayOffset -= 1n;
        }
        const withinDay = shiftedNumerator - dayOffset * dayDenominator;
        const secondsSinceMidnight =
            Number(withinDay) /
            Number(duration.denominator) /
            Number(NANOSECONDS_PER_SECOND);

        return Object.freeze({
            secondsSinceMidnight,
            dayOffset: Number(dayOffset),
            dayOffsetExact: String(dayOffset),
            approximate: duration.approximate,
            inputPrecisionLimited: duration.inputPrecisionLimited
        });
    }

    function convertDurationDetailed(value, fromUnit, toUnit) {
        const duration = durationInNanoseconds(value, fromUnit, "Duration");
        const target = requireUnit(toUnit);
        const converted = reduceFraction(
            duration.numerator,
            duration.denominator * target.nanoseconds
        );
        const display = formatFraction(
            converted.numerator,
            converted.denominator
        );

        return Object.freeze({
            value:
                Number(converted.numerator) /
                Number(converted.denominator),
            formattedValue: display.text,
            approximate: duration.approximate || target.averageGregorian,
            roundedForDisplay: display.rounded,
            scientific: display.scientific,
            inputPrecisionLimited: duration.inputPrecisionLimited
        });
    }

    function convertDuration(value, fromUnit, toUnit) {
        return convertDurationDetailed(value, fromUnit, toUnit).value;
    }

    function formatDuration(value, unit = "seconds") {
        const duration = durationInNanoseconds(value, unit, "Duration");
        return formatHumanNanoseconds(
            duration.numerator,
            duration.denominator
        );
    }

    const api = Object.freeze({
        units,
        calculateIntervals,
        durationBetweenTimes,
        shiftTime,
        convertDuration,
        convertDurationDetailed,
        formatDuration
    });

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.LCLDuration = api;
    }
}(typeof window !== "undefined" ? window : null));
