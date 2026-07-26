(function (root) {
    "use strict";

    function formatHourLabel(hour24, use24Hour) {
        if (use24Hour) {
            return String(hour24).padStart(2, "0");
        }

        const hour12 = hour24 % 12 || 12;
        return String(hour12).padStart(2, "0");
    }

    function formatClockTime(hours, minutes, use24Hour) {
        if (use24Hour) {
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        }

        const hour12 = hours % 12 || 12;
        const suffix = hours < 12 ? "AM" : "PM";
        return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
    }

    function formatDurationHMS(totalSeconds) {
        const wholeSeconds = Math.max(0, Math.floor(totalSeconds));
        const hours = Math.floor(wholeSeconds / 3600);
        const minutes = Math.floor((wholeSeconds % 3600) / 60);
        const seconds = wholeSeconds % 60;

        return [hours, minutes, seconds]
            .map((value) => String(value).padStart(2, "0"))
            .join(":");
    }

    function formatJulianDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const startOfYear = Date.UTC(year, 0, 1);
        const currentDate = Date.UTC(year, month, day);
        const dayOfYear = Math.floor((currentDate - startOfYear) / 86400000) + 1;

        return `${year}-${String(dayOfYear).padStart(3, "0")}`;
    }

    const api = Object.freeze({
        formatHourLabel,
        formatClockTime,
        formatDurationHMS,
        formatJulianDate
    });

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.LCLTime = api;
    }
}(typeof window !== "undefined" ? window : null));
