(function (root) {
    "use strict";

    const MIN_YEAR = 1;
    const MAX_YEAR = 9999;
    const months = Object.freeze([
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]);
    const weekdays = Object.freeze([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]);

    function requireInteger(value, label) {
        if (!Number.isSafeInteger(value)) {
            throw new RangeError(`${label} must be a safe integer`);
        }
        return value;
    }

    function requireYear(year) {
        requireInteger(year, "Year");
        if (year < MIN_YEAR || year > MAX_YEAR) {
            throw new RangeError(
                `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`
            );
        }
        return year;
    }

    function isLeapYear(year) {
        requireYear(year);
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    function daysInMonth(year, month) {
        requireYear(year);
        requireInteger(month, "Month");
        if (month < 1 || month > 12) {
            throw new RangeError("Month must be between 1 and 12");
        }
        if (month === 2) return isLeapYear(year) ? 29 : 28;
        return [4, 6, 9, 11].includes(month) ? 30 : 31;
    }

    function createDate(year, month, day) {
        requireYear(year);
        requireInteger(month, "Month");
        requireInteger(day, "Day");
        const maximumDay = daysInMonth(year, month);
        if (day < 1 || day > maximumDay) {
            throw new RangeError(
                `Day must be between 1 and ${maximumDay} for ${
                    months[month - 1]
                } ${year}`
            );
        }
        return Object.freeze({ year, month, day });
    }

    function parseDateOnly(value) {
        if (typeof value !== "string" || !value.trim()) {
            throw new RangeError("Date is required in YYYY-MM-DD format");
        }
        const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) {
            throw new RangeError("Date is required in YYYY-MM-DD format");
        }
        return createDate(Number(match[1]), Number(match[2]), Number(match[3]));
    }

    function requireDate(value) {
        if (typeof value === "string") return parseDateOnly(value);
        if (!value || typeof value !== "object") {
            throw new RangeError("A valid calendar date is required");
        }
        return createDate(value.year, value.month, value.day);
    }

    function daysFromCivil(value) {
        const date = requireDate(value);
        let year = date.year;
        const month = date.month;
        year -= month <= 2 ? 1 : 0;
        const era = Math.floor(year / 400);
        const yearOfEra = year - era * 400;
        const monthPrime = month + (month > 2 ? -3 : 9);
        const dayOfYear =
            Math.floor((153 * monthPrime + 2) / 5) + date.day - 1;
        const dayOfEra =
            yearOfEra * 365 +
            Math.floor(yearOfEra / 4) -
            Math.floor(yearOfEra / 100) +
            dayOfYear;
        return era * 146097 + dayOfEra - 719468;
    }

    function civilFromDays(serialDay) {
        requireInteger(serialDay, "Calendar day offset");
        const shifted = serialDay + 719468;
        const era = Math.floor(shifted / 146097);
        const dayOfEra = shifted - era * 146097;
        const yearOfEra = Math.floor(
            (dayOfEra -
                Math.floor(dayOfEra / 1460) +
                Math.floor(dayOfEra / 36524) -
                Math.floor(dayOfEra / 146096)) /
                365
        );
        let year = yearOfEra + era * 400;
        const dayOfYear =
            dayOfEra -
            (365 * yearOfEra +
                Math.floor(yearOfEra / 4) -
                Math.floor(yearOfEra / 100));
        const monthPrime = Math.floor((5 * dayOfYear + 2) / 153);
        const day =
            dayOfYear - Math.floor((153 * monthPrime + 2) / 5) + 1;
        const month = monthPrime + (monthPrime < 10 ? 3 : -9);
        year += month <= 2 ? 1 : 0;
        return createDate(year, month, day);
    }

    function addCalendarDays(value, amount) {
        const date = requireDate(value);
        requireInteger(amount, "Day amount");
        return civilFromDays(daysFromCivil(date) + amount);
    }

    function addCalendarWeeks(value, amount) {
        requireInteger(amount, "Week amount");
        if (!Number.isSafeInteger(amount * 7)) {
            throw new RangeError("Week amount is outside the supported range");
        }
        return addCalendarDays(value, amount * 7);
    }

    function addCalendarMonths(value, amount) {
        const date = requireDate(value);
        requireInteger(amount, "Month amount");
        const totalMonths =
            (date.year - 1) * 12 + (date.month - 1) + amount;
        if (totalMonths < 0 || totalMonths > (MAX_YEAR - 1) * 12 + 11) {
            throw new RangeError("Resulting year is outside the supported range");
        }
        const year = Math.floor(totalMonths / 12) + 1;
        const month = totalMonths % 12 + 1;
        const day = Math.min(date.day, daysInMonth(year, month));
        return createDate(year, month, day);
    }

    function addCalendarYears(value, amount) {
        const date = requireDate(value);
        requireInteger(amount, "Year amount");
        const year = date.year + amount;
        requireYear(year);
        const day = Math.min(date.day, daysInMonth(year, date.month));
        return createDate(year, date.month, day);
    }

    function dateFromReference(referenceDate, dayCount, direction) {
        const date = requireDate(referenceDate);
        requireInteger(dayCount, "Day count");
        if (dayCount < 0) {
            throw new RangeError("Day count must be non-negative");
        }
        if (direction !== "future" && direction !== "past") {
            throw new RangeError('Direction must be "future" or "past"');
        }
        return addCalendarDays(date, direction === "future" ? dayCount : -dayCount);
    }

    function daysBetween(startDate, endDate) {
        return daysFromCivil(endDate) - daysFromCivil(startDate);
    }

    function weekdayIndex(value) {
        const index = (daysFromCivil(value) + 4) % 7;
        return index < 0 ? index + 7 : index;
    }

    function weekdayForDate(value) {
        return weekdays[weekdayIndex(value)];
    }

    function formatIsoDate(value) {
        const date = requireDate(value);
        return `${String(date.year).padStart(4, "0")}-${String(
            date.month
        ).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
    }

    function formatDate(value) {
        const date = requireDate(value);
        return `${weekdayForDate(date)}, ${months[date.month - 1]} ${
            date.day
        }, ${date.year}`;
    }

    function requireWeekday(weekday) {
        requireInteger(weekday, "Weekday");
        if (weekday < 0 || weekday > 6) {
            throw new RangeError("Weekday must be between 0 and 6");
        }
        return weekday;
    }

    function nthWeekdayOfMonth(year, month, weekday, occurrence) {
        requireYear(year);
        daysInMonth(year, month);
        requireWeekday(weekday);
        requireInteger(occurrence, "Occurrence");
        if (occurrence < 1 || occurrence > 5) {
            throw new RangeError("Occurrence must be between 1 and 5");
        }
        const firstWeekday = weekdayIndex(createDate(year, month, 1));
        const day =
            1 + ((weekday - firstWeekday + 7) % 7) + (occurrence - 1) * 7;
        return day <= daysInMonth(year, month)
            ? createDate(year, month, day)
            : null;
    }

    function lastWeekdayOfMonth(year, month, weekday) {
        requireYear(year);
        const lastDay = daysInMonth(year, month);
        requireWeekday(weekday);
        const lastWeekday = weekdayIndex(createDate(year, month, lastDay));
        const day = lastDay - ((lastWeekday - weekday + 7) % 7);
        return createDate(year, month, day);
    }

    const api = Object.freeze({
        months,
        weekdays,
        createDate,
        parseDateOnly,
        formatIsoDate,
        formatDate,
        daysBetween,
        addCalendarDays,
        addCalendarWeeks,
        addCalendarMonths,
        addCalendarYears,
        dateFromReference,
        weekdayForDate,
        nthWeekdayOfMonth,
        lastWeekdayOfMonth,
        daysInMonth,
        isLeapYear
    });

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.LCLDate = api;
    }
}(typeof window !== "undefined" ? window : null));
