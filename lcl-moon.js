(function (root) {
    "use strict";

    // Original implementation of orbital geometry and lunar perturbations.
    // Formula reference: https://stjarnhimlen.se/comp/ppcomp.html (sections 4-9).
    // Daily visual estimates, not precise phase-event predictions.
    const radians = Math.PI / 180;
    const sin = (degrees) => Math.sin(degrees * radians);
    const cos = (degrees) => Math.cos(degrees * radians);
    const angle = (y, x) => Math.atan2(y, x) / radians;
    const normalize = (degrees) => ((degrees % 360) + 360) % 360;
    const phaseNames = Object.freeze([
        "New moon", "Waxing crescent", "First quarter", "Waxing gibbous",
        "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"
    ]);

    function orbit(meanAnomaly, eccentricity) {
        const mean = normalize(meanAnomaly) * radians;
        let eccentric = mean;
        for (let iteration = 0; iteration < 6; iteration++) {
            eccentric -= (eccentric - eccentricity * Math.sin(eccentric) - mean) /
                (1 - eccentricity * Math.cos(eccentric));
        }
        return angle(Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentric),
            Math.cos(eccentric) - eccentricity);
    }

    function phaseAt(timestamp) {
        if (typeof timestamp !== "number" || !Number.isFinite(timestamp) ||
            Math.abs(timestamp) > 8640000000000000) {
            throw new RangeError("A valid numeric timestamp is required.");
        }
        const days = (timestamp - Date.UTC(1999, 11, 31)) / 86400000;
        const solarMean = normalize(356.0470 + 0.9856002585 * days);
        const solarPerihelion = 282.9404 + 0.0000470935 * days;
        const solarLongitude = orbit(solarMean, 0.016709 - 0.000000001151 * days) + solarPerihelion;
        const lunarMean = normalize(115.3654 + 13.0649929509 * days);
        const node = normalize(125.1228 - 0.0529538083 * days);
        const perihelion = normalize(318.0634 + 0.1643573223 * days);
        const argument = orbit(lunarMean, 0.054900) + perihelion;
        const x = cos(node) * cos(argument) - sin(node) * sin(argument) * cos(5.1454);
        const y = sin(node) * cos(argument) + cos(node) * sin(argument) * cos(5.1454);
        let longitude = angle(y, x);
        let latitude = angle(sin(argument) * sin(5.1454), Math.hypot(x, y));
        const elongation = lunarMean + perihelion + node - solarMean - solarPerihelion;
        const latitudeArgument = lunarMean + perihelion;
        longitude += -1.274 * sin(lunarMean - 2 * elongation) + 0.658 * sin(2 * elongation)
            - 0.186 * sin(solarMean) - 0.059 * sin(2 * lunarMean - 2 * elongation)
            - 0.057 * sin(lunarMean - 2 * elongation + solarMean)
            + 0.053 * sin(lunarMean + 2 * elongation) + 0.046 * sin(2 * elongation - solarMean)
            + 0.041 * sin(lunarMean - solarMean) - 0.035 * sin(elongation)
            - 0.031 * sin(lunarMean + solarMean) - 0.015 * sin(2 * latitudeArgument - 2 * elongation)
            + 0.011 * sin(lunarMean - 4 * elongation);
        latitude += -0.173 * sin(latitudeArgument - 2 * elongation)
            - 0.055 * sin(lunarMean - latitudeArgument - 2 * elongation)
            - 0.046 * sin(lunarMean + latitudeArgument - 2 * elongation)
            + 0.033 * sin(latitudeArgument + 2 * elongation)
            + 0.017 * sin(2 * lunarMean + latitudeArgument);
        const cycle = normalize(longitude - solarLongitude) / 360;
        const illumination = Math.max(0, Math.min(1,
            (1 - cos(longitude - solarLongitude) * cos(latitude)) / 2));
        const index = Math.floor(cycle * 8 + 0.5) % 8;
        return Object.freeze({ cycle, illumination, waxing: cycle < 0.5, name: phaseNames[index] });
    }

    // Numeric SVG path for a 32 x 32 disc: semicircle plus elliptical terminator.
    function illuminatedPath(illumination, waxing) {
        if (!Number.isFinite(illumination) || illumination < 0 || illumination > 1 ||
            typeof waxing !== "boolean") throw new RangeError("Invalid moon geometry.");
        if (illumination === 0) return "";
        const curvature = 1 - 2 * illumination;
        const radius = Math.abs(curvature * 14).toFixed(5);
        const outerSweep = waxing ? 1 : 0;
        const innerSweep = curvature >= 0 ? 1 - outerSweep : outerSweep;
        const terminator = Math.abs(curvature) < 0.000001
            ? "L 16 2" : `A ${radius} 14 0 0 ${innerSweep} 16 2`;
        return `M 16 2 A 14 14 0 0 ${outerSweep} 16 30 ${terminator} Z`;
    }

    const api = Object.freeze({ phaseAt, illuminatedPath, phaseNames });
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.LCLMoon = api;
}(typeof window !== "undefined" ? window : null));
