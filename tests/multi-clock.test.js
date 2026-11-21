"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const LCLTime = require("../lcl-time.js");
const LCLTimeZone = require("../lcl-timezone.js");
const selector = require("../lcl-timezone-select.js");
const html = fs.readFileSync(path.join(__dirname, "../multi-clock.html"), "utf8").replace(/\r\n/g, "\n");
function between(start, end) {
    const first = html.indexOf(start), last = html.indexOf(end, first + start.length);
    assert.ok(first >= 0 && last > first, `Source boundaries: ${start}`);
    return html.slice(first, last);
}

function boot(instant) {
    let clock = Date.parse(instant), builds = 0, groupCalls = 0;
    const cards = [], intervals = [], events = {}, windowEvents = {}, writes = [];
    const saved = [{ tz: "UTC", label: "Base" }, { tz: "America/New_York", label: "Family" }];
    const storage = new Map([["jm5k_multi_clocks_v2", JSON.stringify(saved)]]);
    class ClockDate extends Date {
        constructor(...args) { super(...(args.length ? args : [clock])); }
        static now() { return clock; }
    }
    class OptionNode {
        constructor() { this.children = []; this.dataset = {}; }
        appendChild(child) { this.children.push(child); }
    }
    const select = new OptionNode();
    select.value = ""; select.replacements = 0;
    Object.defineProperty(select, "options", { get: () => select.children.flatMap((group) => group.children) });
    Object.defineProperty(select, "selectedIndex", { set: (index) => { select.value = select.options[index]?.value || ""; } });
    select.replaceChildren = () => { select.children = []; select.value = ""; select.replacements++; };
    const createCard = (entry) => {
        builds++;
        const nodes = new Map();
        const card = { dataset: { tz: entry.tz }, entry, querySelector(name) {
            if (!nodes.has(name)) nodes.set(name, { style: {}, textContent: "" });
            return nodes.get(name);
        }};
        cards.push(card); return card;
    };
    const ctx = {
        Date: ClockDate, Intl, LCLTime, LCLTimeZone,
        LCLTimeZoneSelect: { ...selector, getZoneGroups(...args) { groupCalls++; return selector.getZoneGroups(...args); } },
        LS_KEY: "jm5k_multi_clocks_v2", tzSelect: select, clocks: [],
        createClockCard: createCard,
        document: {
            createElement: () => new OptionNode(),
            querySelectorAll: (name) => name === ".clock" ? cards : [],
            addEventListener: (name, fn) => { events[name] = fn; }
        },
        window: { addEventListener: (name, fn) => { windowEvents[name] = fn; } },
        localStorage: {
            getItem: (key) => storage.get(key) ?? null,
            setItem(key, value) { writes.push([key, value]); storage.set(key, value); }
        },
        extraClocks: { set innerHTML(value) { cards.length = 0; } },
        renderEmptyState() {}, setActionButtons() {},
        MutationObserver: class { observe() {} },
        setInterval(fn, delay) { const row = { fn, delay, active: true }; intervals.push(row); return intervals.length; },
        clearInterval: (id) => { intervals[id - 1].active = false; }
    };
    vm.createContext(ctx);
    vm.runInContext(
        between("/* ---------- Utilities ---------- */", "/* ---------- Persistence ---------- */") +
        between("function saveClocks()", "/* ---------- Clocks & Reorder ---------- */") +
        between("function tickClock(", "/* ---------- Empty-state & Buttons ---------- */") +
        between("function init(){", "\ninit();") + "\ninit();", ctx);
    return {
        ctx, select, cards, intervals, events, windowEvents, writes, storage,
        createCard, builds: () => builds, groupCalls: () => groupCalls,
        setClock: (value) => { clock = Date.parse(value); },
        runIntervals: () => { for (const timer of [...intervals]) if (timer.active) timer.fn(); }
    };
}

const previousZone = process.env.TZ;
try {
    for (const host of ["America/New_York", "America/Los_Angeles", "UTC", "Pacific/Apia"]) {
        process.env.TZ = host;
        const env = boot("2026-03-08T06:59:59Z");
        for (const [instant, zone, expected, day] of [
            ["2026-03-08T02:30:00Z", "UTC", "02:30:00", 8],
            ["2026-03-08T07:30:00Z", "America/New_York", "03:30:00", 8],
            ["2026-11-01T05:30:00Z", "America/New_York", "01:30:00", 1],
            ["2026-11-01T06:30:00Z", "America/New_York", "01:30:00", 1],
            ["2026-11-21T00:00:00Z", "UTC", "00:00:00", 21],
            ["2026-11-21T00:00:00Z", "Asia/Kathmandu", "05:45:00", 21],
            ["2026-11-21T12:00:00Z", "Pacific/Kiritimati", "02:00:00", 22],
            ["2011-12-30T12:00:00Z", "Pacific/Apia", "02:00:00", 31]
        ]) {
            const parts = env.ctx.getNowInTZ(zone, Date.parse(instant));
            assert.equal(env.ctx.formatZonedTime(parts), expected, `${host}: ${zone} at ${instant}`);
            assert.equal(parts.day, day);
            const [h, m, s] = expected.split(":").map(Number);
            assert.equal(env.ctx.dayPercent(parts), (h * 3600 + m * 60 + s) / 86400 * 100);
        }
        assert.equal(env.writes.length, 0, "startup/refresh do not rewrite saved clocks");
    }

    process.env.TZ = "America/New_York";
    const env = boot("2026-03-08T06:59:59Z");
    const ny = env.cards.find((card) => card.dataset.tz === "America/New_York");
    env.select.value = "America/New_York";
    assert.equal(ny.querySelector(".now").textContent, "01:59:59");
    assert.equal(ny.querySelector(".offset").textContent, "UTC-05:00");
    assert.equal(env.select.children.length, 2, "pinned and ordinary groups preserved");
    assert.ok(env.intervals.some((timer) => timer.fn.name === "refreshDropdown" && timer.delay === 1000));
    for (const name of ["focus", "pageshow"]) assert.equal(typeof env.windowEvents[name], "function");
    assert.equal(typeof env.events.visibilitychange, "function");
    env.setClock("2026-03-08T07:00:00Z"); env.runIntervals();
    assert.equal(ny.querySelector(".now").textContent, "03:00:00");
    assert.equal(ny.querySelector(".offset").textContent, "UTC-04:00");
    assert.equal(env.select.value, "America/New_York");
    assert.match(env.select.options.find((option) => option.value === "America/New_York").textContent, /^UTC-04:00/);
    const replacementCount = env.select.replacements, groupCount = env.groupCalls();
    env.setClock("2026-03-08T07:00:01Z"); env.runIntervals();
    assert.equal(env.groupCalls(), groupCount, "full dropdown calculations run at most once per minute");
    env.setClock("2026-03-08T07:01:00Z"); env.runIntervals();
    assert.equal(env.select.replacements, replacementCount, "unchanged offsets do not replace select DOM");
    assert.equal(env.builds(), 2, "offset refresh never recreates clock cards or label editors");
    assert.equal(env.ctx.clocks[1].label, "Family");
    assert.equal(env.writes.length, 0);

    env.setClock("2026-11-01T05:59:59Z"); env.windowEvents.focus();
    assert.equal(ny.querySelector(".now").textContent, "01:59:59");
    env.setClock("2026-11-01T06:00:00Z"); env.events.visibilitychange();
    assert.equal(ny.querySelector(".now").textContent, "01:00:00");
    assert.equal(ny.querySelector(".offset").textContent, "UTC-05:00");
    assert.match(env.select.options.find((option) => option.value === "America/New_York").textContent, /^UTC-05:00/);
    assert.equal(env.select.value, "America/New_York");

    // A zone absent from the deduplicated list remains included when selected.
    const absent = selector.getSupportedTimeZones().find((zone) => !env.select.options.some((option) => option.value === zone));
    assert.ok(absent);
    env.select.value = absent; env.windowEvents.pageshow();
    assert.ok(env.select.options.some((option) => option.value === absent));
    assert.equal(env.select.value, absent);
    const groups = selector.getZoneGroups(Date.parse("2026-11-01T06:00:00Z"), [absent]);
    assert.equal(env.select.options.map((option) => option.value).join("|"),
        [...groups.pinned, ...groups.timeZones].map((row) => row.timeZone).join("|"), "current offset sorting and pinned order preserved");

    const london = env.createCard({ tz: "Europe/London", label: "London" });
    env.ctx.tickClock(london, "Europe/London", Date.parse("2026-03-29T00:59:59Z"));
    assert.equal(london.querySelector(".offset").textContent, "UTC+00:00");
    env.ctx.tickClock(london, "Europe/London", Date.parse("2026-03-29T01:00:00Z"));
    assert.equal(london.querySelector(".now").textContent, "02:00:00");
    assert.equal(london.querySelector(".offset").textContent, "UTC+01:00");
    env.ctx.nudgeClock("America/New_York", -1); env.ctx.saveClocks();
    const saved = JSON.parse(env.storage.get("jm5k_multi_clocks_v2"));
    assert.equal(saved[0].tz, "America/New_York"); assert.equal(saved[0].label, "Family");
    assert.equal(saved[1].tz, "UTC"); assert.equal(saved[1].label, "Base");
    assert.equal(Object.keys(saved[0]).sort().join(","), "label,tz", "saved schema unchanged");
} finally {
    if (previousZone === undefined) delete process.env.TZ;
    else process.env.TZ = previousZone;
}
console.log("multi-clock.test.js: passed host-independent times, DST jumps/repeats, midnight/fractional zones, live offsets, selection/order, and storage compatibility");
