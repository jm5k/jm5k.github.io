(function (root) {
    "use strict";

    const pinnedTimeZones = Object.freeze([
        "UTC",
        "America/Phoenix",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Berlin",
        "Asia/Tokyo",
        "Asia/Singapore",
        "Australia/Sydney"
    ]);
    const majorTimeZones = Object.freeze([
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Phoenix",
        "Europe/London",
        "Europe/Paris",
        "Europe/Berlin",
        "Asia/Tokyo",
        "Asia/Shanghai",
        "Asia/Singapore",
        "Asia/Kolkata",
        "Australia/Sydney",
        "Pacific/Auckland"
    ]);
    const fallbackTimeZones = Object.freeze([
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Phoenix",
        "America/Toronto",
        "America/Vancouver",
        "America/Winnipeg",
        "America/Regina",
        "America/Edmonton",
        "Europe/London",
        "Europe/Paris",
        "Europe/Berlin",
        "Europe/Madrid",
        "Europe/Rome",
        "Europe/Amsterdam",
        "Europe/Zurich",
        "Europe/Stockholm",
        "Europe/Athens",
        "Europe/Helsinki",
        "Asia/Tokyo",
        "Asia/Seoul",
        "Asia/Shanghai",
        "Asia/Taipei",
        "Asia/Hong_Kong",
        "Asia/Singapore",
        "Asia/Bangkok",
        "Asia/Kolkata",
        "Asia/Kathmandu",
        "Australia/Sydney",
        "Australia/Melbourne",
        "Australia/Perth",
        "Pacific/Auckland",
        "Pacific/Honolulu",
        "Africa/Cairo",
        "Africa/Johannesburg",
        "Africa/Nairobi",
        "America/Bogota",
        "America/Lima",
        "America/Mexico_City",
        "America/Sao_Paulo",
        "America/Argentina/Buenos_Aires",
        "America/Santiago",
        "Asia/Dubai",
        "Asia/Riyadh",
        "Asia/Jerusalem"
    ]);
    const offsetFormatters = new Map();
    const numericFormatters = new Map();
    let supportedTimeZonesCache = null;

    function isTimeZoneSupported(timeZone) {
        if (typeof timeZone !== "string" || !timeZone.trim()) return false;
        try {
            new Intl.DateTimeFormat("en-US", {
                timeZone: timeZone.trim()
            }).format(0);
            return true;
        } catch {
            return false;
        }
    }

    function getSupportedTimeZones() {
        if (supportedTimeZonesCache) return supportedTimeZonesCache;

        let nativeTimeZones = [];
        if (typeof Intl.supportedValuesOf === "function") {
            try {
                nativeTimeZones = Intl.supportedValuesOf("timeZone");
            } catch {
                nativeTimeZones = [];
            }
        }

        const timeZones = new Set();
        for (const timeZone of [
            ...pinnedTimeZones,
            ...majorTimeZones,
            ...fallbackTimeZones,
            ...nativeTimeZones
        ]) {
            if (isTimeZoneSupported(timeZone)) timeZones.add(timeZone);
        }
        supportedTimeZonesCache = Object.freeze([...timeZones].sort());
        return supportedTimeZonesCache;
    }

    function requireTimeZone(timeZone) {
        if (!isTimeZoneSupported(timeZone)) {
            throw new RangeError("A valid IANA time zone is required");
        }
        return timeZone.trim();
    }

    function epochMilliseconds(value) {
        const milliseconds = value instanceof Date ? value.getTime() : value;
        if (!Number.isSafeInteger(milliseconds)) {
            throw new RangeError("Reference instant must be valid milliseconds");
        }
        return milliseconds;
    }

    function getOffsetFormatter(timeZone) {
        if (!offsetFormatters.has(timeZone)) {
            offsetFormatters.set(
                timeZone,
                new Intl.DateTimeFormat("en-US", {
                    timeZone,
                    timeZoneName: "shortOffset"
                })
            );
        }
        return offsetFormatters.get(timeZone);
    }

    function getNumericFormatter(timeZone) {
        if (!numericFormatters.has(timeZone)) {
            numericFormatters.set(
                timeZone,
                new Intl.DateTimeFormat("en-US-u-ca-gregory-nu-latn", {
                    timeZone,
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
        return numericFormatters.get(timeZone);
    }

    function numericOffsetMinutes(timeZone, milliseconds) {
        const values = {};
        for (const part of getNumericFormatter(timeZone).formatToParts(
            new Date(milliseconds)
        )) {
            if (part.type !== "literal") values[part.type] = Number(part.value);
        }
        const date = new Date(0);
        date.setUTCFullYear(values.year, values.month - 1, values.day);
        date.setUTCHours(values.hour, values.minute, values.second, 0);
        const wholeSecondInstant = Math.floor(milliseconds / 1000) * 1000;
        return Math.round((date.getTime() - wholeSecondInstant) / 60000);
    }

    function getOffsetMinutes(timeZone, referenceInstant = Date.now()) {
        const zone = requireTimeZone(timeZone);
        const milliseconds = epochMilliseconds(referenceInstant);
        const namePart = getOffsetFormatter(zone)
            .formatToParts(new Date(milliseconds))
            .find((part) => part.type === "timeZoneName");
        const offsetName = namePart ? namePart.value : "";
        const match = offsetName.match(
            /^(?:UTC|GMT)(?:([+-])(\d{1,2})(?::?(\d{2}))?)?$/i
        );
        if (match) {
            if (!match[1]) return 0;
            const magnitude = Number(match[2]) * 60 + Number(match[3] || 0);
            return match[1] === "-" ? -magnitude : magnitude;
        }
        return numericOffsetMinutes(zone, milliseconds);
    }

    function formatOffset(offsetMinutes) {
        if (!Number.isSafeInteger(offsetMinutes)) {
            throw new RangeError("UTC offset must be whole minutes");
        }
        const sign = offsetMinutes >= 0 ? "+" : "-";
        const absoluteMinutes = Math.abs(offsetMinutes);
        const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, "0");
        const minutes = String(absoluteMinutes % 60).padStart(2, "0");
        return `UTC${sign}${hours}:${minutes}`;
    }

    function formatZoneName(timeZone) {
        const zone = requireTimeZone(timeZone);
        const parts = zone.split("/");
        if (parts.length === 1) return zone;
        const region = parts[0].replace(/_/g, " ");
        const location = parts.slice(1).join(" / ").replace(/_/g, " ");
        return `${region} \u2014 ${location}`;
    }

    function formatZoneLabel(timeZone, referenceInstant = Date.now()) {
        return `${formatOffset(
            getOffsetMinutes(timeZone, referenceInstant)
        )} \u2014 ${formatZoneName(timeZone)}`;
    }

    function freezeRow(timeZone, referenceInstant, pinnedSet) {
        const offsetMinutes = getOffsetMinutes(timeZone, referenceInstant);
        const name = formatZoneName(timeZone);
        return Object.freeze({
            timeZone,
            offsetMinutes,
            name,
            label: `${formatOffset(offsetMinutes)} \u2014 ${name}`,
            isPinned: pinnedSet.has(timeZone)
        });
    }

    function getZoneGroups(referenceInstant = Date.now(), includeTimeZones = []) {
        const milliseconds = epochMilliseconds(referenceInstant);
        if (!Array.isArray(includeTimeZones)) {
            throw new RangeError("Included time zones must be an array");
        }
        const included = includeTimeZones
            .filter((timeZone) => isTimeZoneSupported(timeZone))
            .map((timeZone) => timeZone.trim());
        const pinnedSet = new Set(pinnedTimeZones);
        const keepSet = new Set([...majorTimeZones, ...included]);
        const zones = new Set([...getSupportedTimeZones(), ...included]);
        const rows = [...zones].map((timeZone) =>
            freezeRow(timeZone, milliseconds, pinnedSet)
        );
        rows.sort(
            (left, right) =>
                left.offsetMinutes - right.offsetMinutes ||
                left.name.localeCompare(right.name) ||
                left.timeZone.localeCompare(right.timeZone)
        );

        const retained = new Set();
        const seenOffsets = new Set();
        for (const row of rows) {
            if (!seenOffsets.has(row.offsetMinutes)) {
                seenOffsets.add(row.offsetMinutes);
                retained.add(row.timeZone);
            } else if (pinnedSet.has(row.timeZone) || keepSet.has(row.timeZone)) {
                retained.add(row.timeZone);
            }
        }

        return Object.freeze({
            pinned: Object.freeze(rows.filter((row) => row.isPinned)),
            timeZones: Object.freeze(
                rows.filter(
                    (row) => !row.isPinned && retained.has(row.timeZone)
                )
            )
        });
    }

    const api = Object.freeze({
        pinnedTimeZones,
        getSupportedTimeZones,
        getOffsetMinutes,
        formatOffset,
        formatZoneName,
        formatZoneLabel,
        getZoneGroups
    });

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.LCLTimeZoneSelect = api;
    }
}(typeof window !== "undefined" ? window : null));
