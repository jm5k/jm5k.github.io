"use strict";

const assert = require("node:assert/strict");
const moon = require("../lcl-moon.js");

// Independent phase-event fixtures, in UTC, from the US Naval Observatory:
// https://aa.usno.navy.mil/calculated/moon/phases?date=2026-01-01&format=p&nump=60&submit=Get+Data
const fixtures = [
    ["2026-01-03T10:03:00Z", 0.5, "Full moon"],
    ["2026-01-10T15:48:00Z", 0.75, "Last quarter"],
    ["2026-01-18T19:52:00Z", 0, "New moon"],
    ["2026-01-26T04:47:00Z", 0.25, "First quarter"],
    ["2026-06-15T02:54:00Z", 0, "New moon"],
    ["2026-06-21T21:55:00Z", 0.25, "First quarter"],
    ["2026-06-29T23:56:00Z", 0.5, "Full moon"],
    ["2026-07-07T19:29:00Z", 0.75, "Last quarter"],
    ["2026-12-09T00:52:00Z", 0, "New moon"],
    ["2026-12-17T05:42:00Z", 0.25, "First quarter"],
    ["2026-12-24T01:28:00Z", 0.5, "Full moon"],
    ["2026-12-30T18:59:00Z", 0.75, "Last quarter"]
];
for (const [instant, expectedCycle, expectedName] of fixtures) {
    const phase = moon.phaseAt(Date.parse(instant));
    const distance = Math.abs(phase.cycle - expectedCycle);
    assert.ok(Math.min(distance, 1 - distance) < 0.003, `${instant}: cycle within 1.08 degrees`);
    assert.equal(phase.name, expectedName);
    const expectedLight = (1 - Math.cos(expectedCycle * 2 * Math.PI)) / 2;
    assert.ok(Math.abs(phase.illumination - expectedLight) < 0.01, `${instant}: light fraction`);
}

assert.equal(moon.phaseAt(Date.parse("2026-01-24T12:00:00Z")).waxing, true);
assert.equal(moon.phaseAt(Date.parse("2026-01-12T12:00:00Z")).waxing, false);
for (const year of [1900, 2000, 2024, 2026, 2100]) {
    let prior = null;
    for (let time = Date.UTC(year, 0, 1, 12); time < Date.UTC(year + 1, 0, 1); time += 86400000) {
        const phase = moon.phaseAt(time);
        assert.ok(phase.cycle >= 0 && phase.cycle < 1);
        assert.ok(phase.illumination >= 0 && phase.illumination <= 1);
        assert.ok(moon.phaseNames.includes(phase.name));
        if (prior !== null) {
            const progress = (phase.cycle - prior + 1) % 1;
            assert.ok(progress > 0.02 && progress < 0.05, "daily cycle remains continuous");
        }
        prior = phase.cycle;
        assert.doesNotMatch(moon.illuminatedPath(phase.illumination, phase.waxing), /NaN|Infinity/);
    }
}
for (const bad of [NaN, Infinity, -Infinity, undefined, null, "2026-01-01", 9e15]) {
    assert.throws(() => moon.phaseAt(bad), RangeError);
}
assert.equal(moon.illuminatedPath(0, true), "");
assert.match(moon.illuminatedPath(0.5, true), /A 14 14 0 0 1 16 30 L 16 2/);
assert.match(moon.illuminatedPath(0.5, false), /A 14 14 0 0 0 16 30 L 16 2/);
assert.match(moon.illuminatedPath(1, true), /A 14\.00000 14 0 0 1 16 2/);
for (const bad of [-0.1, 1.1, NaN, Infinity]) {
    assert.throws(() => moon.illuminatedPath(bad, true), RangeError);
}
assert.ok(Object.isFrozen(moon));
assert.ok(Object.isFrozen(moon.phaseNames));
assert.ok(Object.isFrozen(moon.phaseAt(Date.UTC(2026, 0, 1))));
console.log("moon-utils.test.js: passed 12 USNO fixtures, cycle continuity, validation, and icon geometry");
