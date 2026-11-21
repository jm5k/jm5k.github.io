"use strict";

// Execute the actual controllers with fake clocks and a small recording DOM.
// Animation callbacks never run; interval/lifecycle callbacks are driven by tests.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const LCLTime = require("../lcl-time.js");

class Element {
    constructor(tag = "div") {
        this.tagName = tag.toUpperCase(); this.children = []; this.style = {};
        this.dataset = {}; this.attributes = {}; this.events = {}; this.value = "";
        this.checked = false; this.textContent = ""; this.className = "";
        this.classList = { add() {}, remove() {}, toggle() {} };
    }
    append(...children) { this.children.push(...children); }
    appendChild(child) { this.append(child); return child; }
    set innerHTML(markup) { this.children = []; this.markup = markup; }
    get innerHTML() { return this.markup || ""; }
    setAttribute(key, value) { this.attributes[key] = String(value); }
    getAttribute(key) { return this.attributes[key] ?? null; }
    addEventListener(name, fn) { (this.events[name] ||= []).push(fn); }
    fire(name) { for (const fn of this.events[name] || []) fn({ target: this }); }
    click() { this.onclick?.(); this.fire("click"); }
    querySelectorAll(selector) {
        return this.children.flatMap((child) => [child, ...child.querySelectorAll("*")])
            .filter((child) => selector === "*" ||
                (selector.startsWith(".") && child.className.split(/\s+/).includes(selector.slice(1))));
    }
    querySelector(selector) {
        const found = this.querySelectorAll(selector)[0];
        if (found) return found;
        const child = new Element(); child.className = selector.replace(/^\./, "");
        this.append(child); return child;
    }
    play() { this.plays = (this.plays || 0) + 1; return Promise.resolve(); }
}

function boot(file, hook, saved = {}) {
    let clock = Date.UTC(2026, 10, 21, 12);
    class ClockDate extends Date {
        constructor(...args) { super(...(args.length ? args : [clock])); }
        static now() { return clock; }
    }
    const elements = new Map(), storage = new Map(Object.entries(saved));
    const intervals = [], timeouts = [], writes = [], alerts = [];
    const get = (id) => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
    for (const [id, value] of Object.entries({ workMins: "25", shortMins: "5", longMins: "15", cycles: "4", minInput: "5", secInput: "0" })) get(id).value = value;
    get("autoAdvance").checked = true;
    const document = new Element();
    document.title = "Test"; document.hidden = false; document.activeElement = new Element("body");
    document.getElementById = get;
    document.createElement = (tag) => new Element(tag);
    document.querySelector = (selector) => get(selector.startsWith("#") ? selector.slice(1) : selector);
    document.querySelectorAll = (selector) => [...elements.values()].flatMap((el) => el.querySelectorAll(selector));
    const window = new Element();
    let id = 0;
    const context = {
        document, window, Date: ClockDate, LCLTime, console,
        performance: { now: () => 100 }, // Deliberately frozen while the wall clock advances.
        crypto: { randomUUID: () => `timer-${++id}` },
        localStorage: {
            getItem: (key) => storage.get(key) ?? null,
            setItem(key, value) { storage.set(key, value); writes.push({ key, value }); },
            removeItem: (key) => storage.delete(key)
        },
        setInterval(fn, ms) { intervals.push({ fn, ms }); return intervals.length; },
        setTimeout(fn, ms) { timeouts.push({ fn, ms }); return timeouts.length; },
        clearInterval() {},
        requestAnimationFrame() { throw Error("Timer bookkeeping must not require animation frames"); },
        alert: (message) => alerts.push(message)
    };
    const html = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    const controller = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
    const marker = file === "timer.html" ? "    // Boot:" : "  // Init";
    assert.ok(controller.includes(marker));
    vm.runInNewContext(controller.replace(marker, `${hook}\n${marker}`), context, { filename: file });
    const tick = intervals.find((interval) => interval.ms === 250 && interval.fn.name === "tick");
    assert.ok(tick, `${file}: independent deadline interval registered`);
    for (const name of ["focus", "pageshow"]) assert.ok(window.events[name]?.length);
    assert.ok(document.events.visibilitychange?.length);
    return {
        api: context.testAPI, get, writes, storage, alerts, document, window,
        tick: tick.fn, now: () => clock, advance: (ms) => { clock += ms; },
        flushSaves: () => { for (const callback of timeouts.splice(0)) if (callback.ms === 150) callback.fn(); }
    };
}

const timerHook = `globalThis.testAPI = { addTimer, toggleRun, pauseAll, resumeAll, resetTimer, saveState, loadState, get timers(){ return timers; } };`;
const timer = boot("timer.html", timerHook);
const t = timer.api;
t.timers.length = 0;
for (const [minutes, seconds] of [[-1, 0], [1, -1], [0, 60], [0, 1.5], [0.5, 0], ["bad", 0], [Infinity, 0], [0, 0], [Number.MAX_SAFE_INTEGER, 0], ["1e309", 0]]) {
    assert.equal(t.addTimer("Invalid", minutes, seconds), false);
    assert.equal(t.timers.length, 0);
    assert.equal(timer.get("minInput").getAttribute("aria-invalid"), "true");
}
assert.equal(t.addTimer("Countdown", 0, 10), true);
assert.equal(timer.get("timer-error").textContent, "");
timer.get("labelInput").value = "Keep this label";
timer.get("minInput").value = "-1"; timer.get("secInput").value = "0";
timer.get("addBtn").click();
assert.equal(timer.get("labelInput").value, "Keep this label", "invalid Add preserves input");
assert.equal(t.timers.length, 1);
timer.get("minInput").value = "1"; timer.get("secInput").value = "59";
timer.get("addBtn").click();
assert.equal(t.timers[1].totalMs, 119000, "valid whole minute/second input");
assert.equal(timer.get("labelInput").value, "");
t.timers.pop();
const countdown = t.timers[0];
t.toggleRun(countdown.id);
assert.equal(countdown.deadlineAt, timer.now() + 10000);
timer.document.hidden = true;
timer.advance(2000); timer.tick();
assert.equal(countdown.remainingMs, 8000, "hidden interval works without animation or performance clock advancement");
timer.advance(500); t.pauseAll();
assert.equal(countdown.remainingMs, 7500, "pause accounts for time since last callback");
timer.advance(100000); timer.tick();
assert.equal(countdown.remainingMs, 7500);
t.resumeAll();
const deadline = countdown.deadlineAt;
timer.advance(1000); t.resumeAll();
assert.equal(countdown.deadlineAt, deadline, "Resume All does not restart an already running timer");
timer.advance(7000); timer.tick();
assert.equal(countdown.remainingMs, 0);
assert.equal(countdown.running, false);
assert.equal(timer.alerts.length, 1);
timer.tick(); timer.window.fire("focus"); timer.window.fire("pageshow");
assert.equal(timer.alerts.length, 1, "completion alerts only once");
t.resetTimer(countdown.id); t.toggleRun(countdown.id);
timer.advance(11000); timer.document.fire("visibilitychange");
assert.equal(countdown.remainingMs, 0, "resume catches an overdue deadline");
assert.equal(timer.alerts.length, 2);
t.resetTimer(countdown.id); t.toggleRun(countdown.id); timer.advance(3000); timer.tick(); t.saveState();
const payload = JSON.parse(timer.storage.get("lcl_timers_v1"));
assert.equal(payload[0].running, false);
assert.equal(payload[0].remainingMs, 7000);
assert.equal("deadlineAt" in payload[0], false, "runtime deadlines do not change saved schema");
const reloaded = boot("timer.html", timerHook, Object.fromEntries(timer.storage));
assert.equal(reloaded.api.timers[0].running, false);
reloaded.advance(60000); reloaded.tick();
assert.equal(reloaded.api.timers[0].remainingMs, 7000, "reload restores paused");

const focusHook = `globalThis.testAPI = { start, pause, reset, skip, finishPhase, tick, get state(){ return state; } };`;
const focus = boot("focus.html", focusHook);
const f = focus.api;
const settingsWrites = () => focus.writes.filter((write) => write.key === "focusline:v1").length;
focus.get("autoAdvance").checked = false; focus.get("autoAdvance").fire("change");
assert.equal(settingsWrites(), 1);
f.start();
const completedAt = f.state.deadlineAt;
focus.document.hidden = true;
for (let i = 0; i < 100; i++) { focus.advance(250); focus.tick(); }
assert.equal(settingsWrites(), 1, "running ticks never rewrite settings");
focus.advance(25 * 60000); focus.tick();
assert.equal(f.state.completed, true);
assert.equal(f.state.running, false);
assert.equal(focus.get("startPause").textContent, "Start next");
let history = JSON.parse(focus.storage.get("focusline:history"));
assert.equal(history.length, 1);
assert.equal(history[0].m, 25);
assert.equal(history[0].t, completedAt, "late callbacks retain actual deadline for daily history");
f.finishPhase(); focus.tick(); focus.window.fire("pageshow");
assert.equal(JSON.parse(focus.storage.get("focusline:history")).length, 1);
f.start();
assert.equal(f.state.phase, "Short Break", "Start next advances instead of recounting completed work");
assert.equal(f.state.running, true);
focus.tick();
assert.equal(JSON.parse(focus.storage.get("focusline:history")).length, 1);
focus.advance(500); f.pause();
assert.equal(f.state.elapsedMs, 500);
focus.advance(100000); focus.tick();
assert.equal(f.state.elapsedMs, 500);
f.start();
assert.equal(f.state.deadlineAt, focus.now() + 5 * 60000 - 500);
f.reset();
assert.equal(f.state.elapsedMs, 0); assert.equal(f.state.running, false);
f.skip(); // Short break -> Work.
f.start(); focus.advance(2 * 60000); f.pause(); f.skip();
history = JSON.parse(focus.storage.get("focusline:history"));
assert.equal(history.length, 2); assert.equal(history[1].m, 2, "paused partial work credited once on Skip");
f.skip();
assert.equal(JSON.parse(focus.storage.get("focusline:history")).length, 2);
focus.get("soundOn").checked = true; focus.get("soundOn").fire("change");
assert.equal(settingsWrites(), 2, "checkbox preferences save immediately while paused");

const auto = boot("focus.html", focusHook);
auto.api.start(); auto.advance(3 * 60 * 60000); auto.window.fire("focus");
assert.equal(auto.api.state.phase, "Short Break");
assert.equal(auto.api.state.running, false, "auto-advance preserves ready-but-paused next phase");
assert.equal(JSON.parse(auto.storage.get("focusline:history")).length, 1);
auto.advance(3 * 60 * 60000); auto.tick();
assert.equal(JSON.parse(auto.storage.get("focusline:history")).length, 1, "no unattended cycle backfill");
auto.api.skip(); auto.api.start(); auto.advance(10 * 60000);
auto.get("workMins").value = "50"; auto.get("workMins").fire("change");
assert.equal(auto.api.state.elapsedMs, 20 * 60000);
assert.equal(auto.api.state.deadlineAt, auto.now() + 30 * 60000, "duration changes update deadline at same progress ratio");
const focusReload = boot("focus.html", focusHook, Object.fromEntries(focus.storage));
assert.equal(focusReload.api.state.phase, "Work");
assert.equal(focusReload.api.state.running, false);
assert.equal(focusReload.get("soundOn").checked, true);

console.log("timer-focus.test.js: passed independent deadlines, suspension catch-up, exactly-once completion, pause/reset/reload, input validation, and settings-write checks");
