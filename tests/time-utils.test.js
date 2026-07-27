"use strict";

const assert = require("node:assert/strict");
const LCLTime = require("../lcl-time.js");

function localDate(year, monthIndex, day) {
    return new Date(year, monthIndex, day, 12, 0, 0);
}

assert.deepEqual(Object.keys(LCLTime), [
    "formatHourLabel",
    "formatClockTime",
    "formatDurationHMS",
    "formatJulianDate"
]);

assert.equal(LCLTime.formatJulianDate(localDate(2026, 0, 1)), "2026-001");
assert.equal(LCLTime.formatJulianDate(localDate(2026, 6, 26)), "2026-207");
assert.equal(LCLTime.formatJulianDate(localDate(2026, 11, 31)), "2026-365");
assert.equal(LCLTime.formatJulianDate(localDate(2024, 1, 29)), "2024-060");
assert.equal(LCLTime.formatJulianDate(localDate(2024, 11, 31)), "2024-366");

assert.equal(LCLTime.formatClockTime(0, 5, true), "00:05");
assert.equal(LCLTime.formatClockTime(13, 7, true), "13:07");
assert.equal(LCLTime.formatClockTime(0, 5, false), "12:05 AM");
assert.equal(LCLTime.formatClockTime(12, 0, false), "12:00 PM");
assert.equal(LCLTime.formatClockTime(13, 7, false), "01:07 PM");
assert.equal(LCLTime.formatClockTime(23, 59, false), "11:59 PM");

assert.equal(LCLTime.formatHourLabel(0, true), "00");
assert.equal(LCLTime.formatHourLabel(13, true), "13");
assert.equal(LCLTime.formatHourLabel(0, false), "12");
assert.equal(LCLTime.formatHourLabel(13, false), "01");
assert.equal(LCLTime.formatHourLabel(24, false), "12");

assert.equal(LCLTime.formatDurationHMS(0), "00:00:00");
assert.equal(LCLTime.formatDurationHMS(59), "00:00:59");
assert.equal(LCLTime.formatDurationHMS(60), "00:01:00");
assert.equal(LCLTime.formatDurationHMS(3661), "01:01:01");
assert.equal(LCLTime.formatDurationHMS(90000), "25:00:00");
assert.equal(LCLTime.formatDurationHMS(-1), "00:00:00");

assert.ok(Object.isFrozen(LCLTime));

console.log("time-utils.test.js: all tests passed");
