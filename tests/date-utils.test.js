"use strict";

const assert = require("node:assert/strict");
const LCLDate = require("../lcl-date.js");

const date = (year, month, day) => LCLDate.createDate(year, month, day);

assert.deepEqual(Object.keys(LCLDate), [
    "months",
    "weekdays",
    "createDate",
    "parseDateOnly",
    "formatIsoDate",
    "formatDate",
    "daysBetween",
    "addCalendarDays",
    "addCalendarWeeks",
    "addCalendarMonths",
    "addCalendarYears",
    "dateFromReference",
    "weekdayForDate",
    "nthWeekdayOfMonth",
    "lastWeekdayOfMonth",
    "daysInMonth",
    "isLeapYear"
]);

assert.equal(LCLDate.isLeapYear(2000), true);
assert.equal(LCLDate.isLeapYear(2100), false);
assert.equal(LCLDate.isLeapYear(2400), true);
assert.equal(LCLDate.daysInMonth(2000, 2), 29);
assert.equal(LCLDate.daysInMonth(2100, 2), 28);
assert.deepEqual(LCLDate.parseDateOnly("2000-02-29"), date(2000, 2, 29));
assert.deepEqual(LCLDate.parseDateOnly("2400-02-29"), date(2400, 2, 29));
assert.throws(() => LCLDate.parseDateOnly("2100-02-29"), /Day must be/);

assert.equal(LCLDate.weekdayForDate(date(1969, 7, 20)), "Sunday");
assert.equal(LCLDate.weekdayForDate(date(2000, 1, 1)), "Saturday");
assert.equal(LCLDate.weekdayForDate(date(2743, 3, 2)), "Tuesday");
assert.equal(
    LCLDate.formatDate(date(2743, 3, 2)),
    "Tuesday, March 2, 2743"
);

assert.deepEqual(
    LCLDate.nthWeekdayOfMonth(2743, 3, 2, 1),
    date(2743, 3, 2)
);
assert.deepEqual(
    LCLDate.lastWeekdayOfMonth(2030, 11, 5),
    date(2030, 11, 29)
);
assert.deepEqual(
    LCLDate.nthWeekdayOfMonth(2035, 10, 1, 2),
    date(2035, 10, 8)
);
assert.deepEqual(
    LCLDate.nthWeekdayOfMonth(2024, 3, 5, 5),
    date(2024, 3, 29)
);
assert.equal(LCLDate.nthWeekdayOfMonth(2021, 2, 1, 5), null);

assert.equal(LCLDate.daysBetween(date(2026, 8, 6), date(2026, 8, 6)), 0);
assert.equal(LCLDate.daysBetween(date(2026, 8, 6), date(2026, 8, 7)), 1);
assert.equal(LCLDate.daysBetween(date(2026, 1, 31), date(2026, 2, 1)), 1);
assert.equal(LCLDate.daysBetween(date(2025, 12, 31), date(2026, 1, 1)), 1);
assert.equal(LCLDate.daysBetween(date(2020, 2, 28), date(2020, 3, 1)), 2);
assert.equal(LCLDate.daysBetween(date(2026, 8, 7), date(2026, 8, 6)), -1);

assert.deepEqual(LCLDate.addCalendarDays(date(2026, 12, 31), 1), date(2027, 1, 1));
assert.deepEqual(LCLDate.addCalendarDays(date(2027, 1, 1), -1), date(2026, 12, 31));
assert.deepEqual(LCLDate.addCalendarWeeks(date(2026, 8, 6), 2), date(2026, 8, 20));
assert.deepEqual(LCLDate.addCalendarWeeks(date(2026, 8, 6), -2), date(2026, 7, 23));
assert.deepEqual(LCLDate.addCalendarMonths(date(2023, 1, 31), 1), date(2023, 2, 28));
assert.deepEqual(LCLDate.addCalendarMonths(date(2024, 1, 31), 1), date(2024, 2, 29));
assert.deepEqual(LCLDate.addCalendarMonths(date(2024, 3, 31), -1), date(2024, 2, 29));
assert.deepEqual(LCLDate.addCalendarYears(date(2028, 2, 29), 1), date(2029, 2, 28));
assert.deepEqual(LCLDate.addCalendarYears(date(2000, 2, 29), 400), date(2400, 2, 29));
assert.deepEqual(LCLDate.addCalendarYears(date(2099, 3, 1), 1), date(2100, 3, 1));

const reference = date(2026, 8, 6);
assert.deepEqual(
    LCLDate.dateFromReference(reference, 100, "future"),
    date(2026, 11, 14)
);
assert.deepEqual(
    LCLDate.dateFromReference(reference, 30, "past"),
    date(2026, 7, 7)
);
assert.equal(
    LCLDate.formatDate(LCLDate.dateFromReference(reference, 100, "future")),
    "Saturday, November 14, 2026"
);

assert.equal(LCLDate.formatIsoDate(date(1, 1, 1)), "0001-01-01");
assert.ok(Object.isFrozen(LCLDate));
assert.ok(Object.isFrozen(LCLDate.months));
assert.ok(Object.isFrozen(LCLDate.weekdays));
assert.ok(Object.isFrozen(date(2026, 8, 6)));

assert.throws(() => LCLDate.parseDateOnly(""), /required/);
assert.throws(() => LCLDate.parseDateOnly("2026-2-03"), /YYYY-MM-DD/);
assert.throws(() => LCLDate.createDate(2026, 2, 29), /Day must be/);
assert.throws(() => LCLDate.createDate(2026, 4, 31), /Day must be/);
assert.throws(() => LCLDate.createDate(0, 1, 1), /Year must be/);
assert.throws(() => LCLDate.createDate(10000, 1, 1), /Year must be/);
assert.throws(() => LCLDate.createDate(2026, 0, 1), /Month must be/);
assert.throws(() => LCLDate.dateFromReference(reference, -1, "future"), /non-negative/);
assert.throws(() => LCLDate.dateFromReference(reference, 1, "sideways"), /Direction/);
assert.throws(() => LCLDate.nthWeekdayOfMonth(2026, 1, 7, 1), /Weekday/);
assert.throws(() => LCLDate.nthWeekdayOfMonth(2026, 1, 1, 0), /Occurrence/);
assert.throws(() => LCLDate.addCalendarYears(date(9999, 1, 1), 1), /Year must be/);

console.log("date-utils.test.js: all tests passed");
