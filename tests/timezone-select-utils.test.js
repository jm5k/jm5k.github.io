"use strict";

const assert = require("node:assert/strict");
const LCLTimeZoneSelect = require("../lcl-timezone-select.js");

const expectedApi = [
    "pinnedTimeZones",
    "getSupportedTimeZones",
    "getOffsetMinutes",
    "formatOffset",
    "formatZoneName",
    "formatZoneLabel",
    "getZoneGroups"
];

assert.deepEqual(Object.keys(LCLTimeZoneSelect), expectedApi);
assert.ok(Object.isFrozen(LCLTimeZoneSelect));
assert.ok(Object.isFrozen(LCLTimeZoneSelect.pinnedTimeZones));
assert.deepEqual(LCLTimeZoneSelect.pinnedTimeZones, [
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

const supported = LCLTimeZoneSelect.getSupportedTimeZones();
assert.ok(Object.isFrozen(supported));
for (const timeZone of LCLTimeZoneSelect.pinnedTimeZones) {
    assert.ok(supported.includes(timeZone), `${timeZone} must be supported`);
}

const winter = Date.parse("2026-01-15T17:00:00Z");
const summer = Date.parse("2026-07-15T16:00:00Z");
assert.equal(
    LCLTimeZoneSelect.getOffsetMinutes("America/New_York", winter),
    -300
);
assert.equal(
    LCLTimeZoneSelect.getOffsetMinutes("America/New_York", summer),
    -240
);
assert.equal(LCLTimeZoneSelect.getOffsetMinutes("Europe/London", winter), 0);
assert.equal(LCLTimeZoneSelect.getOffsetMinutes("Europe/London", summer), 60);
assert.equal(LCLTimeZoneSelect.getOffsetMinutes("Asia/Kolkata", winter), 330);
assert.equal(LCLTimeZoneSelect.getOffsetMinutes("Asia/Kathmandu", winter), 345);

assert.equal(LCLTimeZoneSelect.formatOffset(-420), "UTC-07:00");
assert.equal(LCLTimeZoneSelect.formatOffset(0), "UTC+00:00");
assert.equal(LCLTimeZoneSelect.formatOffset(345), "UTC+05:45");
assert.equal(
    LCLTimeZoneSelect.formatZoneName("America/Los_Angeles"),
    "America \u2014 Los Angeles"
);
assert.equal(
    LCLTimeZoneSelect.formatZoneLabel("America/New_York", winter),
    "UTC-05:00 \u2014 America \u2014 New York"
);
assert.equal(
    LCLTimeZoneSelect.formatZoneLabel("America/New_York", summer),
    "UTC-04:00 \u2014 America \u2014 New York"
);

function assertSorted(rows, label) {
    for (let index = 1; index < rows.length; index += 1) {
        const previous = rows[index - 1];
        const current = rows[index];
        const comparison =
            previous.offsetMinutes - current.offsetMinutes ||
            previous.name.localeCompare(current.name) ||
            previous.timeZone.localeCompare(current.timeZone);
        assert.ok(comparison <= 0, `${label} must be offset/name sorted`);
    }
}

const winterGroups = LCLTimeZoneSelect.getZoneGroups(winter);
const summerGroups = LCLTimeZoneSelect.getZoneGroups(summer);
for (const groups of [winterGroups, summerGroups]) {
    assert.ok(Object.isFrozen(groups));
    assert.ok(Object.isFrozen(groups.pinned));
    assert.ok(Object.isFrozen(groups.timeZones));
    assertSorted(groups.pinned, "Pinned group");
    assertSorted(groups.timeZones, "Time Zones group");
    assert.deepEqual(
        new Set(groups.pinned.map((row) => row.timeZone)),
        new Set(LCLTimeZoneSelect.pinnedTimeZones)
    );
    assert.equal(
        groups.timeZones.some((row) => row.isPinned),
        false,
        "Pinned zones must not be repeated in the main group"
    );
    for (const row of [...groups.pinned, ...groups.timeZones]) {
        assert.ok(Object.isFrozen(row));
        assert.match(row.label, /^UTC[+-]\d{2}:\d{2} \u2014 /);
    }
}

const winterNewYork = winterGroups.pinned.find(
    (row) => row.timeZone === "America/New_York"
);
const summerNewYork = summerGroups.pinned.find(
    (row) => row.timeZone === "America/New_York"
);
assert.equal(winterNewYork.offsetMinutes, -300);
assert.equal(summerNewYork.offsetMinutes, -240);
assert.notEqual(winterNewYork.label, summerNewYork.label);

const includedZone = "America/Indiana/Indianapolis";
if (supported.includes(includedZone)) {
    const includedGroups = LCLTimeZoneSelect.getZoneGroups(winter, [includedZone]);
    assert.ok(
        [...includedGroups.pinned, ...includedGroups.timeZones].some(
            (row) => row.timeZone === includedZone
        ),
        "An explicitly included selected zone must survive offset deduplication"
    );
}

assert.throws(() => LCLTimeZoneSelect.getOffsetMinutes("Mars/Olympus_Mons", winter));
assert.throws(() => LCLTimeZoneSelect.formatOffset(1.5));
assert.throws(() => LCLTimeZoneSelect.getZoneGroups(winter, "UTC"));

console.log("timezone-select-utils.test.js: all tests passed");
