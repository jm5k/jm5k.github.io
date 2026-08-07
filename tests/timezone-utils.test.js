"use strict";

const assert = require("node:assert/strict");
const LCLTimeZone = require("../lcl-timezone.js");

const local = (year, month, day, hour, minute, second = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second
});

const expectedApi = [
    "minYear",
    "maxYear",
    "getBrowserTimeZone",
    "isTimeZoneSupported",
    "parseLocalDateTime",
    "resolveLocalDateTime",
    "zonedLocalTimeToInstant",
    "instantToZonedParts",
    "getUtcOffset",
    "formatUtcOffset",
    "convertZonedDateTime",
    "detectDayDifference",
    "formatDateInput",
    "formatTimeInput"
];

assert.deepEqual(Object.keys(LCLTimeZone), expectedApi);
assert.ok(Object.isFrozen(LCLTimeZone));
assert.equal(LCLTimeZone.minYear, 1900);
assert.equal(LCLTimeZone.maxYear, 9999);

for (const zone of [
    "UTC",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Asia/Kolkata",
    "Asia/Kathmandu"
]) {
    assert.ok(LCLTimeZone.isTimeZoneSupported(zone));
}
assert.ok(LCLTimeZone.isTimeZoneSupported(LCLTimeZone.getBrowserTimeZone()));
assert.equal(LCLTimeZone.isTimeZoneSupported("Mars/Olympus_Mons"), false);

assert.deepEqual(
    LCLTimeZone.parseLocalDateTime("2026-01-15", "12:00"),
    local(2026, 1, 15, 12, 0)
);
assert.equal(
    LCLTimeZone.formatDateInput(local(2026, 1, 5, 7, 8)),
    "2026-01-05"
);
assert.equal(
    LCLTimeZone.formatTimeInput(local(2026, 1, 5, 7, 8)),
    "07:08"
);
const winter = LCLTimeZone.convertZonedDateTime(
    local(2026, 1, 15, 12, 0),
    "America/New_York",
    "Europe/London"
);
assert.equal(winter.epochMilliseconds, Date.parse("2026-01-15T17:00:00Z"));
assert.deepEqual(winter.destination, local(2026, 1, 15, 17, 0));
assert.equal(winter.sourceOffset.minutes, -300);
assert.equal(winter.destinationOffset.minutes, 0);
assert.equal(winter.sourceOffset.abbreviation, "EST");
assert.match(winter.destinationOffset.abbreviation, /^(?:GMT|UTC)$/);

const summer = LCLTimeZone.convertZonedDateTime(
    local(2026, 7, 15, 12, 0),
    "America/New_York",
    "Europe/London"
);
assert.equal(summer.epochMilliseconds, Date.parse("2026-07-15T16:00:00Z"));
assert.deepEqual(summer.destination, local(2026, 7, 15, 17, 0));
assert.equal(summer.sourceOffset.minutes, -240);
assert.equal(summer.destinationOffset.minutes, 60);
assert.equal(summer.sourceOffset.abbreviation, "EDT");
assert.match(summer.destinationOffset.abbreviation, /^(?:BST|GMT\+1)$/);

const tokyoBoundary = LCLTimeZone.convertZonedDateTime(
    local(2026, 11, 8, 15, 30),
    "America/New_York",
    "Asia/Tokyo"
);
assert.deepEqual(tokyoBoundary.destination, local(2026, 11, 9, 5, 30));
assert.equal(tokyoBoundary.dayDifference, 1);

const previousDay = LCLTimeZone.convertZonedDateTime(
    local(2026, 1, 15, 9, 0),
    "Asia/Tokyo",
    "America/Los_Angeles"
);
assert.deepEqual(previousDay.destination, local(2026, 1, 14, 16, 0));
assert.equal(previousDay.dayDifference, -1);

const utcToKolkata = LCLTimeZone.convertZonedDateTime(
    local(2026, 1, 15, 12, 0),
    "UTC",
    "Asia/Kolkata"
);
assert.deepEqual(utcToKolkata.destination, local(2026, 1, 15, 17, 30));
assert.equal(utcToKolkata.destinationOffset.minutes, 330);

const kolkataToUtc = LCLTimeZone.convertZonedDateTime(
    local(2026, 1, 15, 12, 0),
    "Asia/Kolkata",
    "UTC"
);
assert.deepEqual(kolkataToUtc.destination, local(2026, 1, 15, 6, 30));
assert.equal(kolkataToUtc.sourceOffset.minutes, 330);

const kathmandu = LCLTimeZone.convertZonedDateTime(
    local(2026, 1, 15, 12, 0),
    "UTC",
    "Asia/Kathmandu"
);
assert.deepEqual(kathmandu.destination, local(2026, 1, 15, 17, 45));
assert.equal(kathmandu.destinationOffset.minutes, 345);

const springGap = LCLTimeZone.resolveLocalDateTime(
    local(2026, 3, 8, 2, 30),
    "America/New_York"
);
assert.equal(springGap.status, "nonexistent");
assert.equal(springGap.candidates.length, 0);
assert.throws(
    () => LCLTimeZone.zonedLocalTimeToInstant(
        local(2026, 3, 8, 2, 30),
        "America/New_York"
    ),
    (error) => error.code === "NONEXISTENT_LOCAL_TIME"
);

const fallOverlap = LCLTimeZone.resolveLocalDateTime(
    local(2026, 11, 1, 1, 30),
    "America/New_York"
);
assert.equal(fallOverlap.status, "ambiguous");
assert.equal(fallOverlap.candidates.length, 2);
assert.deepEqual(
    fallOverlap.candidates.map((candidate) => candidate.offsetMinutes),
    [-240, -300]
);
assert.throws(
    () => LCLTimeZone.zonedLocalTimeToInstant(
        local(2026, 11, 1, 1, 30),
        "America/New_York"
    ),
    (error) => error.code === "AMBIGUOUS_LOCAL_TIME"
);
const earlierOverlap = LCLTimeZone.zonedLocalTimeToInstant(
    local(2026, 11, 1, 1, 30),
    "America/New_York",
    "earlier"
);
const laterOverlap = LCLTimeZone.zonedLocalTimeToInstant(
    local(2026, 11, 1, 1, 30),
    "America/New_York",
    "later"
);
assert.equal(earlierOverlap, Date.parse("2026-11-01T05:30:00Z"));
assert.equal(laterOverlap, Date.parse("2026-11-01T06:30:00Z"));
assert.equal(laterOverlap - earlierOverlap, 60 * 60 * 1000);

const swapped = LCLTimeZone.convertZonedDateTime(
    tokyoBoundary.destination,
    "Asia/Tokyo",
    "America/New_York"
);
assert.equal(swapped.epochMilliseconds, tokyoBoundary.epochMilliseconds);
assert.deepEqual(swapped.destination, tokyoBoundary.source);

const historical = LCLTimeZone.convertZonedDateTime(
    local(1969, 7, 20, 16, 17),
    "America/New_York",
    "UTC"
);
assert.equal(historical.sourceOffset.minutes, -240);
assert.deepEqual(historical.destination, local(1969, 7, 20, 20, 17));

const future = LCLTimeZone.convertZonedDateTime(
    local(2035, 12, 15, 12, 0),
    "Australia/Sydney",
    "UTC"
);
assert.equal(future.sourceOffset.minutes, 660);
assert.deepEqual(future.destination, local(2035, 12, 15, 1, 0));

assert.equal(LCLTimeZone.formatUtcOffset(9 * 60 * 60 * 1000), "UTC+09:00");
assert.equal(LCLTimeZone.formatUtcOffset(-5 * 60 * 60 * 1000), "UTC-05:00");
assert.equal(LCLTimeZone.formatUtcOffset(5.5 * 60 * 60 * 1000), "UTC+05:30");
assert.equal(
    LCLTimeZone.detectDayDifference(
        local(2026, 11, 8, 15, 30),
        local(2026, 11, 9, 5, 30)
    ),
    1
);
assert.equal(
    LCLTimeZone.detectDayDifference(
        local(2026, 11, 9, 5, 30),
        local(2026, 11, 8, 15, 30)
    ),
    -1
);
assert.equal(
    LCLTimeZone.detectDayDifference(
        local(2026, 11, 8, 15, 30),
        local(2026, 11, 8, 20, 30)
    ),
    0
);

for (const [dateValue, timeValue] of [
    ["", "12:00"],
    ["2026-02-29", "12:00"],
    ["1899-12-31", "12:00"],
    ["2026-01-15", "24:00"],
    ["2026-01-15", "12:60"]
]) {
    assert.throws(() => LCLTimeZone.parseLocalDateTime(dateValue, timeValue));
}
assert.throws(() =>
    LCLTimeZone.convertZonedDateTime(
        local(2026, 1, 15, 12, 0),
        "Mars/Olympus_Mons",
        "UTC"
    )
);
assert.throws(() =>
    LCLTimeZone.zonedLocalTimeToInstant(
        local(2026, 1, 15, 12, 0),
        "UTC",
        "guess"
    )
);

console.log("timezone-utils.test.js: all tests passed");
