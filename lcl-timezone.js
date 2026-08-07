(function (root) {
    "use strict";

    const MIN_YEAR = 1900;
    const MAX_YEAR = 9999;
    const HOUR_MILLISECONDS = 60 * 60 * 1000;
    const PARTS_LOCALE = "en-US-u-ca-gregory-nu-latn";
    const partsFormatters = new Map();
    const nameFormatters = new Map();

    function requireInteger(value, label) {
        if (!Number.isSafeInteger(value)) {
            throw new RangeError(`${label} must be a safe integer`);
        }
        return value;
    }

    function isLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    function daysInMonth(year, month) {
        if (month === 2) return isLeapYear(year) ? 29 : 28;
        return [4, 6, 9, 11].includes(month) ? 30 : 31;
    }

    function requireLocalDateTime(value) {
        if (!value || typeof value !== "object") {
            throw new RangeError("A local date and time is required");
        }

        const year = requireInteger(value.year, "Year");
        const month = requireInteger(value.month, "Month");
        const day = requireInteger(value.day, "Day");
        const hour = requireInteger(value.hour, "Hour");
        const minute = requireInteger(value.minute, "Minute");
        const second = requireInteger(value.second ?? 0, "Second");

        if (year < MIN_YEAR || year > MAX_YEAR) {
            throw new RangeError(
                `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`
            );
        }
        if (month < 1 || month > 12) {
            throw new RangeError("Month must be between 1 and 12");
        }
        const maximumDay = daysInMonth(year, month);
        if (day < 1 || day > maximumDay) {
            throw new RangeError("Day does not exist in the selected month");
        }
        if (hour < 0 || hour > 23) {
            throw new RangeError("Hour must be between 0 and 23");
        }
        if (minute < 0 || minute > 59) {
            throw new RangeError("Minute must be between 0 and 59");
        }
        if (second < 0 || second > 59) {
            throw new RangeError("Second must be between 0 and 59");
        }

        return Object.freeze({ year, month, day, hour, minute, second });
    }

    function parseLocalDateTime(dateValue, timeValue) {
        if (typeof dateValue !== "string" || typeof timeValue !== "string") {
            throw new RangeError("Date and time are required");
        }
        const dateMatch = dateValue.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
        const timeMatch = timeValue.trim().match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
        if (!dateMatch || !timeMatch) {
            throw new RangeError("Date and time must use valid numeric fields");
        }
        return requireLocalDateTime({
            year: Number(dateMatch[1]),
            month: Number(dateMatch[2]),
            day: Number(dateMatch[3]),
            hour: Number(timeMatch[1]),
            minute: Number(timeMatch[2]),
            second: Number(timeMatch[3] || 0)
        });
    }

    function isTimeZoneSupported(timeZone) {
        if (typeof timeZone !== "string" || !timeZone.trim()) return false;
        try {
            new Intl.DateTimeFormat(PARTS_LOCALE, {
                timeZone: timeZone.trim()
            }).format(0);
            return true;
        } catch {
            return false;
        }
    }

    function requireTimeZone(timeZone) {
        if (!isTimeZoneSupported(timeZone)) {
            throw new RangeError("A valid IANA time zone is required");
        }
        return timeZone.trim();
    }

    function getBrowserTimeZone() {
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return isTimeZoneSupported(timeZone) ? timeZone : "UTC";
        } catch {
            return "UTC";
        }
    }

    function getPartsFormatter(timeZone) {
        const zone = requireTimeZone(timeZone);
        if (!partsFormatters.has(zone)) {
            partsFormatters.set(
                zone,
                new Intl.DateTimeFormat(PARTS_LOCALE, {
                    timeZone: zone,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hourCycle: "h23"
                })
            );
        }
        return partsFormatters.get(zone);
    }

    function utcEpochFromParts(value) {
        const date = new Date(0);
        date.setUTCFullYear(value.year, value.month - 1, value.day);
        date.setUTCHours(value.hour, value.minute, value.second, 0);
        return date.getTime();
    }

    function instantToZonedParts(epochMilliseconds, timeZone) {
        if (!Number.isSafeInteger(epochMilliseconds)) {
            throw new RangeError("Instant must be a safe integer millisecond value");
        }
        const formatter = getPartsFormatter(timeZone);
        const values = {};
        for (const part of formatter.formatToParts(new Date(epochMilliseconds))) {
            if (part.type !== "literal") values[part.type] = part.value;
        }
        return Object.freeze({
            year: Number(values.year),
            month: Number(values.month),
            day: Number(values.day),
            hour: Number(values.hour),
            minute: Number(values.minute),
            second: Number(values.second)
        });
    }

    function getShortTimeZoneName(epochMilliseconds, timeZone) {
        const zone = requireTimeZone(timeZone);
        const names = [];
        for (const locale of ["en-US", "en-GB"]) {
            const key = `${locale}|${zone}`;
            if (!nameFormatters.has(key)) {
                nameFormatters.set(
                    key,
                    new Intl.DateTimeFormat(locale, {
                        timeZone: zone,
                        timeZoneName: "short"
                    })
                );
            }
            const namePart = nameFormatters
                .get(key)
                .formatToParts(new Date(epochMilliseconds))
                .find((part) => part.type === "timeZoneName");
            if (namePart) names.push(namePart.value);
        }
        return names.find((name) => !/^(?:GMT|UTC)[+-]/.test(name)) || names[0] || zone;
    }

    function formatUtcOffset(offsetMilliseconds) {
        if (!Number.isSafeInteger(offsetMilliseconds)) {
            throw new RangeError("UTC offset must be a safe integer millisecond value");
        }
        const sign = offsetMilliseconds < 0 ? "-" : "+";
        const totalSeconds = Math.abs(Math.trunc(offsetMilliseconds / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const base = `UTC${sign}${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}`;
        return seconds
            ? `${base}:${String(seconds).padStart(2, "0")}`
            : base;
    }

    function getUtcOffset(epochMilliseconds, timeZone) {
        const parts = instantToZonedParts(epochMilliseconds, timeZone);
        const wholeSecondInstant = Math.floor(epochMilliseconds / 1000) * 1000;
        const milliseconds = utcEpochFromParts(parts) - wholeSecondInstant;
        return Object.freeze({
            milliseconds,
            minutes: milliseconds / 60000,
            label: formatUtcOffset(milliseconds),
            abbreviation: getShortTimeZoneName(epochMilliseconds, timeZone)
        });
    }

    function sameLocalDateTime(left, right) {
        return (
            left.year === right.year &&
            left.month === right.month &&
            left.day === right.day &&
            left.hour === right.hour &&
            left.minute === right.minute &&
            left.second === right.second
        );
    }

    function candidateForInstant(epochMilliseconds, timeZone) {
        const offset = getUtcOffset(epochMilliseconds, timeZone);
        return Object.freeze({
            epochMilliseconds,
            offsetMilliseconds: offset.milliseconds,
            offsetMinutes: offset.minutes,
            offsetLabel: offset.label,
            abbreviation: offset.abbreviation
        });
    }

    function resolveLocalDateTime(value, timeZone) {
        const localDateTime = requireLocalDateTime(value);
        const zone = requireTimeZone(timeZone);
        const localAsUtc = utcEpochFromParts(localDateTime);
        const offsets = new Set();

        for (let hourDelta = -48; hourDelta <= 48; hourDelta += 6) {
            offsets.add(
                getUtcOffset(
                    localAsUtc + hourDelta * HOUR_MILLISECONDS,
                    zone
                ).milliseconds
            );
        }

        const candidates = [];
        const candidateInstants = new Set();
        for (const offsetMilliseconds of offsets) {
            const epochMilliseconds = localAsUtc - offsetMilliseconds;
            if (candidateInstants.has(epochMilliseconds)) continue;
            const roundTrip = instantToZonedParts(epochMilliseconds, zone);
            if (sameLocalDateTime(roundTrip, localDateTime)) {
                candidateInstants.add(epochMilliseconds);
                candidates.push(candidateForInstant(epochMilliseconds, zone));
            }
        }
        candidates.sort(
            (left, right) => left.epochMilliseconds - right.epochMilliseconds
        );

        const status =
            candidates.length === 0
                ? "nonexistent"
                : candidates.length === 1
                    ? "valid"
                    : "ambiguous";
        return Object.freeze({
            status,
            localDateTime,
            timeZone: zone,
            candidates: Object.freeze(candidates)
        });
    }

    function resolutionError(message, code) {
        const error = new RangeError(message);
        error.code = code;
        return error;
    }

    function zonedLocalTimeToInstant(value, timeZone, disambiguation = "reject") {
        if (!["reject", "earlier", "later"].includes(disambiguation)) {
            throw new RangeError(
                'Disambiguation must be "reject", "earlier", or "later"'
            );
        }
        const resolution = resolveLocalDateTime(value, timeZone);
        if (resolution.status === "nonexistent") {
            throw resolutionError(
                "This local time does not exist because of a daylight-saving transition.",
                "NONEXISTENT_LOCAL_TIME"
            );
        }
        if (resolution.status === "ambiguous" && disambiguation === "reject") {
            throw resolutionError(
                "This local time occurs twice because of a daylight-saving transition.",
                "AMBIGUOUS_LOCAL_TIME"
            );
        }
        const candidate =
            disambiguation === "later"
                ? resolution.candidates[resolution.candidates.length - 1]
                : resolution.candidates[0];
        return candidate.epochMilliseconds;
    }

    function daysFromCivil(value) {
        let year = value.year;
        year -= value.month <= 2 ? 1 : 0;
        const era = Math.floor(year / 400);
        const yearOfEra = year - era * 400;
        const monthPrime = value.month + (value.month > 2 ? -3 : 9);
        const dayOfYear =
            Math.floor((153 * monthPrime + 2) / 5) + value.day - 1;
        const dayOfEra =
            yearOfEra * 365 +
            Math.floor(yearOfEra / 4) -
            Math.floor(yearOfEra / 100) +
            dayOfYear;
        return era * 146097 + dayOfEra - 719468;
    }

    function detectDayDifference(sourceParts, destinationParts) {
        const source = requireLocalDateTime(sourceParts);
        const destination = requireLocalDateTime(destinationParts);
        return daysFromCivil(destination) - daysFromCivil(source);
    }

    function convertZonedDateTime(
        value,
        sourceTimeZone,
        destinationTimeZone,
        disambiguation = "reject"
    ) {
        const epochMilliseconds = zonedLocalTimeToInstant(
            value,
            sourceTimeZone,
            disambiguation
        );
        const source = instantToZonedParts(epochMilliseconds, sourceTimeZone);
        const destination = instantToZonedParts(
            epochMilliseconds,
            destinationTimeZone
        );
        return Object.freeze({
            epochMilliseconds,
            source,
            destination,
            sourceOffset: getUtcOffset(epochMilliseconds, sourceTimeZone),
            destinationOffset: getUtcOffset(
                epochMilliseconds,
                destinationTimeZone
            ),
            dayDifference: detectDayDifference(source, destination)
        });
    }

    function formatDateInput(value) {
        const parts = requireLocalDateTime(value);
        return `${String(parts.year).padStart(4, "0")}-${String(
            parts.month
        ).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
    }

    function formatTimeInput(value) {
        const parts = requireLocalDateTime(value);
        return `${String(parts.hour).padStart(2, "0")}:${String(
            parts.minute
        ).padStart(2, "0")}`;
    }

    const api = Object.freeze({
        minYear: MIN_YEAR,
        maxYear: MAX_YEAR,
        getBrowserTimeZone,
        isTimeZoneSupported,
        parseLocalDateTime,
        resolveLocalDateTime,
        zonedLocalTimeToInstant,
        instantToZonedParts,
        getUtcOffset,
        formatUtcOffset,
        convertZonedDateTime,
        detectDayDifference,
        formatDateInput,
        formatTimeInput
    });

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.LCLTimeZone = api;
    }
}(typeof window !== "undefined" ? window : null));
