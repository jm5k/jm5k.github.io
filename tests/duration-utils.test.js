"use strict";

const assert = require("node:assert/strict");
const LCLDuration = require("../lcl-duration.js");

const time = (hours, minutes = 0, seconds = 0) =>
    hours * 3600 + minutes * 60 + seconds;

assert.deepEqual(Object.keys(LCLDuration), [
    "units",
    "calculateIntervals",
    "durationBetweenTimes",
    "shiftTime",
    "convertDuration",
    "convertDurationDetailed",
    "formatDuration"
]);

assert.deepEqual(
    LCLDuration.units.map((unit) => unit.id),
    [
        "nanoseconds",
        "microseconds",
        "milliseconds",
        "seconds",
        "minutes",
        "hours",
        "days",
        "weeks",
        "months",
        "years",
        "decades"
    ]
);
assert.ok(Object.isFrozen(LCLDuration.units));
assert.ok(LCLDuration.units.every(Object.isFrozen));

const exactIntervals = LCLDuration.calculateIntervals(
    33,
    "hours",
    18,
    "minutes"
);
assert.equal(exactIntervals.completeIntervals, 110);
assert.equal(exactIntervals.completeIntervalsExact, "110");
assert.equal(exactIntervals.completeIntervalsText, "110");
assert.equal(exactIntervals.remainderSeconds, 0);
assert.equal(exactIntervals.remainderText, "0 seconds");
assert.equal(exactIntervals.exactIntervals, 110);
assert.equal(exactIntervals.exactIntervalsText, "110");
assert.equal(exactIntervals.approximate, false);

const intervalRemainder = LCLDuration.calculateIntervals(
    10,
    "hours",
    45,
    "minutes"
);
assert.equal(intervalRemainder.completeIntervals, 13);
assert.equal(intervalRemainder.remainderSeconds, 15 * 60);
assert.equal(intervalRemainder.remainderText, "15 minutes");
assert.equal(intervalRemainder.exactIntervalsText, "13.333333333333");
assert.ok(Math.abs(intervalRemainder.exactIntervals - 13.333333333333334) < 1e-12);

const nanosInMillisecond = LCLDuration.calculateIntervals(
    "1",
    "milliseconds",
    "1",
    "nanoseconds"
);
assert.equal(nanosInMillisecond.completeIntervalsExact, "1000000");
assert.equal(nanosInMillisecond.completeIntervalsText, "1,000,000");
assert.equal(nanosInMillisecond.remainderText, "0 seconds");

const averageIntervals = LCLDuration.calculateIntervals(
    1,
    "years",
    1,
    "months"
);
assert.equal(averageIntervals.completeIntervals, 12);
assert.equal(averageIntervals.approximate, true);

assert.equal(
    LCLDuration.durationBetweenTimes(time(8, 35), time(16, 20)),
    time(7, 45)
);
assert.equal(
    LCLDuration.durationBetweenTimes(time(22, 30), time(1, 15)),
    time(2, 45)
);
assert.equal(LCLDuration.durationBetweenTimes(0, 0), 0);

const addedTime = LCLDuration.shiftTime(
    time(14, 45),
    95,
    "minutes",
    "add"
);
assert.equal(addedTime.secondsSinceMidnight, time(16, 20));
assert.equal(addedTime.dayOffset, 0);
assert.equal(addedTime.dayOffsetExact, "0");
assert.equal(addedTime.approximate, false);

const subtractedTime = LCLDuration.shiftTime(
    time(0, 30),
    90,
    "minutes",
    "subtract"
);
assert.equal(subtractedTime.secondsSinceMidnight, time(23));
assert.equal(subtractedTime.dayOffset, -1);
assert.equal(subtractedTime.dayOffsetExact, "-1");

const nextDay = LCLDuration.shiftTime(
    time(23, 30),
    2,
    "hours",
    "add"
);
assert.equal(nextDay.secondsSinceMidnight, time(1, 30));
assert.equal(nextDay.dayOffset, 1);

const averageYearShift = LCLDuration.shiftTime(0, 1, "years", "add");
assert.equal(averageYearShift.secondsSinceMidnight, time(5, 49, 12));
assert.equal(averageYearShift.dayOffsetExact, "365");
assert.equal(averageYearShift.approximate, true);

assert.equal(LCLDuration.convertDuration(1, "seconds", "milliseconds"), 1000);
assert.equal(
    LCLDuration.convertDuration(1, "milliseconds", "nanoseconds"),
    1000000
);
assert.equal(
    LCLDuration.convertDuration(1, "seconds", "nanoseconds"),
    1000000000
);
assert.equal(LCLDuration.convertDuration(1, "minutes", "seconds"), 60);
assert.equal(LCLDuration.convertDuration(1, "hours", "minutes"), 60);
assert.equal(LCLDuration.convertDuration(1, "days", "hours"), 24);
assert.equal(LCLDuration.convertDuration(1, "weeks", "days"), 7);
assert.equal(LCLDuration.convertDuration(1000, "milliseconds", "seconds"), 1);
assert.equal(LCLDuration.convertDuration(7, "days", "weeks"), 1);
assert.equal(LCLDuration.convertDuration(2, "days", "hours"), 48);
assert.equal(LCLDuration.convertDuration(1.5, "hours", "minutes"), 90);
assert.equal(LCLDuration.convertDuration(2, "minutes", "seconds"), 120);
assert.equal(LCLDuration.convertDuration(3600, "seconds", "hours"), 1);
assert.equal(LCLDuration.convertDuration(0, "days", "seconds"), 0);

assert.equal(LCLDuration.convertDuration(1, "years", "days"), 365.2425);
assert.equal(
    LCLDuration.convertDuration(1, "months", "days"),
    365.2425 / 12
);
assert.equal(LCLDuration.convertDuration(1, "decades", "years"), 10);
assert.equal(LCLDuration.convertDuration(1, "decades", "days"), 3652.425);
assert.ok(
    Math.abs(
        LCLDuration.convertDuration(1, "days", "years") -
            1 / 365.2425
    ) < 1e-15
);

const averageYear = LCLDuration.convertDurationDetailed(
    "1",
    "years",
    "seconds"
);
assert.equal(averageYear.formattedValue, "31,556,952");
assert.equal(averageYear.approximate, true);
assert.equal(averageYear.roundedForDisplay, false);

const averageMonth = LCLDuration.convertDurationDetailed(
    "1",
    "months",
    "days"
);
assert.equal(averageMonth.formattedValue, "30.436875");
assert.equal(averageMonth.approximate, true);

const decadeDays = LCLDuration.convertDurationDetailed(
    "1",
    "decades",
    "days"
);
assert.equal(decadeDays.formattedValue, "3,652.425");
assert.equal(decadeDays.approximate, true);

const decadeNanoseconds = LCLDuration.convertDurationDetailed(
    "1",
    "decades",
    "nanoseconds"
);
assert.equal(
    decadeNanoseconds.formattedValue,
    "315,569,520,000,000,000"
);
assert.equal(decadeNanoseconds.approximate, true);
assert.equal(decadeNanoseconds.roundedForDisplay, false);

const fractionalNanoseconds = LCLDuration.convertDurationDetailed(
    "0.1",
    "milliseconds",
    "nanoseconds"
);
assert.equal(fractionalNanoseconds.formattedValue, "100,000");
assert.equal(fractionalNanoseconds.value, 100000);

const oneNanosecondInSeconds = LCLDuration.convertDurationDetailed(
    "1",
    "nanoseconds",
    "seconds"
);
assert.equal(oneNanosecondInSeconds.formattedValue, "0.000000001");
assert.equal(oneNanosecondInSeconds.value, 1e-9);
assert.equal(oneNanosecondInSeconds.roundedForDisplay, false);

const fractionalSecondInNanoseconds = LCLDuration.convertDurationDetailed(
    "0.000000001",
    "seconds",
    "nanoseconds"
);
assert.equal(fractionalSecondInNanoseconds.formattedValue, "1");
assert.equal(fractionalSecondInNanoseconds.value, 1);

const verySmallAverage = LCLDuration.convertDurationDetailed(
    "1",
    "nanoseconds",
    "decades"
);
assert.equal(verySmallAverage.scientific, true);
assert.equal(verySmallAverage.approximate, true);
assert.match(verySmallAverage.formattedValue, /^3\.168873850681e-18$/);

const exactUnsafeInteger = LCLDuration.convertDurationDetailed(
    "9007199254740993",
    "nanoseconds",
    "nanoseconds"
);
assert.equal(
    exactUnsafeInteger.formattedValue,
    "9,007,199,254,740,993"
);
assert.equal(exactUnsafeInteger.inputPrecisionLimited, false);

const limitedNumberInput = LCLDuration.convertDurationDetailed(
    9007199254740993,
    "nanoseconds",
    "nanoseconds"
);
assert.equal(limitedNumberInput.inputPrecisionLimited, true);

const hugeDuration = LCLDuration.convertDurationDetailed(
    "1e12",
    "decades",
    "nanoseconds"
);
assert.equal(hugeDuration.scientific, true);
assert.match(hugeDuration.formattedValue, /^3\.1556952e\+29$/);

assert.equal(
    LCLDuration.formatDuration(time(51, 14)),
    "2 days 3 hours 14 minutes"
);
assert.equal(LCLDuration.formatDuration(0), "0 seconds");
assert.equal(LCLDuration.formatDuration(90.5), "1 minute 30.5 seconds");
assert.equal(
    LCLDuration.formatDuration("90061000", "milliseconds"),
    "1 day 1 hour 1 minute 1 second"
);
assert.equal(
    LCLDuration.formatDuration("0.000000001", "seconds"),
    "1 nanosecond"
);
assert.equal(
    LCLDuration.formatDuration("1.5", "hours"),
    "1 hour 30 minutes"
);

assert.throws(
    () => LCLDuration.calculateIntervals(-1, "hours", 10, "minutes"),
    /non-negative/
);
assert.throws(
    () => LCLDuration.calculateIntervals(1, "hours", 0, "minutes"),
    /greater than zero/
);
assert.throws(
    () => LCLDuration.calculateIntervals(1, "hours", -5, "minutes"),
    /non-negative/
);
assert.throws(
    () => LCLDuration.durationBetweenTimes(-1, time(1)),
    /non-negative/
);
assert.throws(
    () => LCLDuration.durationBetweenTimes(86400, 0),
    /less than 86400/
);
assert.throws(
    () => LCLDuration.shiftTime(0, -1, "minutes", "add"),
    /non-negative/
);
assert.throws(
    () => LCLDuration.shiftTime(0, 1, "minutes", "multiply"),
    /Operation/
);
assert.throws(
    () => LCLDuration.convertDuration(1, "fortnights", "days"),
    /Unsupported duration unit/
);
assert.throws(
    () => LCLDuration.convertDuration(Number.NaN, "hours", "minutes"),
    /finite/
);
assert.throws(
    () => LCLDuration.convertDuration("not-a-number", "hours", "minutes"),
    /finite/
);
assert.throws(
    () => LCLDuration.convertDuration("-0.5", "seconds", "nanoseconds"),
    /non-negative/
);
assert.throws(
    () => LCLDuration.convertDuration("1e1001", "seconds", "nanoseconds"),
    /practical range/
);

assert.ok(Object.isFrozen(LCLDuration));
assert.ok(Object.isFrozen(intervalRemainder));

console.log("duration-utils.test.js: all tests passed");
