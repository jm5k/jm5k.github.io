"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const LCLTime = require("../lcl-time.js");
const LCLMoon = require("../lcl-moon.js");
const html = fs.readFileSync(path.join(__dirname, "../clock_presets.html"), "utf8");
function between(start, end) {
    const first = html.indexOf(start), last = html.indexOf(end, first + start.length);
    assert.ok(first >= 0 && last > first, `Source boundaries: ${start}`);
    return html.slice(first, last);
}
function boot(saved, storageBlocked = false) {
    let clock = new Date(2026, 10, 21, 13, 5, 9).getTime();
    class ClockDate extends Date {
        constructor(...args) { super(...(args.length ? args : [clock])); }
    }
    const writes = [], storage = new Map();
    if (saved !== undefined) storage.set("use24h", saved);
    const hourLabels = {
        children: [], style: { "--label-offset": "0.5ch" },
        replaceChildren() { this.children = []; },
        appendChild(child) { this.children.push(child); }
    };
    const toggle = { checked: false, addEventListener(name, callback) { this[name] = callback; } };
    const node = () => ({ textContent: "" });
    const ctx = {
        LCLTime, LCLMoon, Date: ClockDate, console, FORMAT_KEY: "use24h", hourLabels,
        moonLink: { dataset: {}, setAttribute(key, value) { this[key] = value; } },
        moonLight: { setAttribute(key, value) { this[key] = value; } },
        formatToggle: toggle, formatLabel: node(),
        marker: { style: {} }, nowTop: node(), pctElapsed: node(), pctRemain: node(), timeLeft: node(), julianDate: node(),
        document: { createElement: () => ({ style: {}, textContent: "" }) },
        localStorage: {
            getItem(key) { if (storageBlocked) throw Error("Storage blocked"); return storage.get(key) ?? null; },
            setItem(key, value) { if (storageBlocked) throw Error("Storage blocked"); storage.set(key, value); writes.push([key, value]); }
        },
        setInterval() {}
    };
    vm.createContext(ctx);
    vm.runInContext(
        between("  function loadTimeFormat(){", "  const loadLabelOffset") +
        between("  function renderHourLabels(){", "  /* Update loop") +
        between("  function update(){", "  /* Load persisted preset & glow */"), ctx);
    return { ctx, toggle, hourLabels, storage, writes, setHour: (hour) => { clock = new Date(2026, 10, 21, hour, 5, 9).getTime(); } };
}
const env = boot("true");
assert.match(env.ctx.moonLink["aria-label"], /illuminated\. Open moon phases calendar/);
assert.equal(env.ctx.moonLight.d, LCLMoon.illuminatedPath(LCLMoon.phaseAt(new Date(2026, 10, 21, 13, 5, 9).getTime()).illumination, LCLMoon.phaseAt(new Date(2026, 10, 21, 13, 5, 9).getTime()).waxing));
assert.equal(env.toggle.checked, true);
assert.equal(env.ctx.nowTop.textContent, "13:05");
assert.equal(env.ctx.timeLeft.textContent, "10:54:51", "time-left countdown retains seconds");
assert.equal(env.ctx.formatLabel.textContent, "24-hour");
assert.equal(env.hourLabels.children.length, 24);
assert.equal(env.hourLabels.children[12].textContent, "13");
assert.equal(env.hourLabels.children[23].textContent, "24");
const positions = env.hourLabels.children.map((label) => label.style.left).join("|");
const stats = [env.ctx.marker.style.left, env.ctx.pctElapsed.textContent, env.ctx.pctRemain.textContent, env.ctx.timeLeft.textContent, env.ctx.julianDate.textContent].join("|");
env.toggle.checked = false; env.toggle.change();
assert.equal(env.ctx.nowTop.textContent, "01:05 PM");
assert.equal(env.ctx.timeLeft.textContent, "10:54:51");
assert.equal(env.ctx.formatLabel.textContent, "12-hour");
assert.equal(env.hourLabels.children[11].textContent, "12");
assert.equal(env.hourLabels.children[12].textContent, "01");
assert.equal(env.hourLabels.children[23].textContent, "12");
assert.equal(env.hourLabels.children.length, 24, "toggle replaces labels instead of duplicating them");
assert.equal(env.hourLabels.children.map((label) => label.style.left).join("|"), positions);
assert.equal(env.hourLabels.style["--label-offset"], "0.5ch");
assert.equal([env.ctx.marker.style.left, env.ctx.pctElapsed.textContent, env.ctx.pctRemain.textContent, env.ctx.timeLeft.textContent, env.ctx.julianDate.textContent].join("|"), stats, "display format does not change clock calculations");
assert.equal(env.storage.get("use24h"), "false");
assert.equal(boot(env.storage.get("use24h")).toggle.checked, false, "shared preference restores on reload");
for (const [hour, expected] of [[0, "12:05 AM"], [12, "12:05 PM"], [23, "11:05 PM"]]) {
    env.setHour(hour); env.ctx.update(); assert.equal(env.ctx.nowTop.textContent, expected);
}
env.toggle.checked = true; env.toggle.change();
assert.equal(env.ctx.nowTop.textContent, "23:05");
assert.equal(env.storage.get("use24h"), "true");
assert.equal(env.writes.length, 2);
for (const invalid of [undefined, "{bad", "null", '"12h"', "1"]) assert.equal(boot(invalid).toggle.checked, true);
const blocked = boot("false", true);
assert.equal(blocked.toggle.checked, true);
blocked.toggle.checked = false;
assert.doesNotThrow(() => blocked.toggle.change());
assert.equal(blocked.ctx.nowTop.textContent, "01:05 PM", "live toggle works when preference storage is blocked");
const panelStart = html.indexOf('<details id="themePanel">');
const panelEnd = html.indexOf("</details>", panelStart);
const toggleAt = html.indexOf('id="formatToggle"');
assert.ok(toggleAt > panelStart && toggleAt < panelEnd, "toggle stays inside settings panel");
assert.match(html, /const FORMAT_KEY = 'use24h'/);
const options = [...between('<select id="theme">', '</select>').matchAll(/<option value="([^"]+)"/g)].map(match => match[1]);
function visibility(saved, blocked = false) {
    let stored = saved;
    const toggle = { addEventListener(name, callback) { this[name] = callback; } };
    const ctx = {
        DIGITAL_CLOCK_KEY: "lcl-clock-presets-show-digital",
        digitalClockToggle: toggle, nowTop: {},
        localStorage: {
            getItem() { if (blocked) throw Error("blocked"); return stored ?? null; },
            setItem(key, value) { if (blocked) throw Error("blocked"); stored = value; }
        }
    };
    vm.createContext(ctx);
    vm.runInContext(between("  function loadDigitalClock(){", "  function selectPreset(value){"), ctx);
    return { toggle, readout: ctx.nowTop, saved: () => stored };
}
for (const invalid of [undefined, "null", '"false"', "{bad"]) {
    assert.equal(visibility(invalid).readout.hidden, false, "default is visible");
}
const visible = visibility("false");
assert.equal(visible.readout.hidden, true);
visible.toggle.checked = true; visible.toggle.change();
assert.equal(visible.readout.hidden, false);
assert.equal(visibility(visible.saved()).readout.hidden, false);
visible.toggle.checked = false; visible.toggle.change();
assert.equal(visible.readout.hidden, true);
assert.equal(visibility(visible.saved()).readout.hidden, true);
const noStorage = visibility(undefined, true);
noStorage.toggle.checked = false;
assert.doesNotThrow(() => noStorage.toggle.change());
assert.equal(noStorage.readout.hidden, true);
const visibilityAt = html.indexOf('id="digitalClockToggle"');
assert.ok(visibilityAt > panelStart && visibilityAt < panelEnd);
assert.equal(options.length, 12);
const removed = ["mono", "ghostline", "solar", "midnight"];
for (const preset of removed) {
    assert.ok(!options.includes(preset));
    assert.ok(!html.includes('html[data-theme="' + preset + '"]'));
}
function themeContext(saved) {
    const storage = new Map([["clock_theme", saved], ["clock_glow", "0.8"], ["clock_custom_vars_v1", '{"--accent":"#123456"}']]);
    const styles = {}, attributes = {};
    const ctx = {
        themeSel: { options: options.map(value => ({ value })) },
        root: { setAttribute(key, value) { attributes[key] = value; } },
        localStorage: {
            getItem(key) { return storage.get(key) ?? null; },
            setItem(key, value) { storage.set(key, value); }
        },
        THEME_KEY: "clock_theme", GLOW_KEY: "clock_glow",
        glow: {}, css(key, value) { styles[key] = value; }
    };
    vm.createContext(ctx);
    vm.runInContext(between("  function selectPreset(value){", "  /* Color pickers"), ctx);
    return { ctx, storage, styles, attributes };
}
for (const preset of [...removed, "unknown", null, ...options]) {
    const current = themeContext(preset);
    const expected = options.includes(preset) ? preset : "technolust";
    assert.equal(current.attributes["data-theme"], expected);
    assert.equal(current.ctx.themeSel.value, expected);
    assert.equal(current.storage.get("clock_theme"), preset, "loading preserves stored data");
    assert.equal(current.storage.get("clock_custom_vars_v1"), '{"--accent":"#123456"}');
    assert.equal(current.styles["--glow"], "0.8");
}
async function checkImports() {
    for (const preset of [...removed, ...options]) {
        const current = themeContext("technolust");
        let imported, notice;
        Object.assign(current.ctx, {
            themeFile: { value: "file", addEventListener(name, callback) { imported = callback; } },
            applyCustomVars(vars) { Object.assign(current.styles, vars); },
            saveCustomVars(vars) { current.storage.set("clock_custom_vars_v1", JSON.stringify(vars)); },
            loadCustomVars() { return JSON.parse(current.storage.get("clock_custom_vars_v1")); },
            seedPickersFromComputed() {},
            alert(message) { notice = message; }
        });
        vm.runInContext(between("  themeFile.addEventListener('change', async (e) => {", "  /* Initial UI state"), current.ctx);
        await imported({ target: { files: [{ text: async () => JSON.stringify({ preset, glow: 0.4, vars: { "--accent": "#abcdef" } }) }] } });
        assert.equal(notice, "Theme imported.");
        assert.equal(current.storage.get("clock_theme"), options.includes(preset) ? preset : "technolust");
        assert.equal(current.styles["--accent"], "#abcdef");
        assert.equal(current.styles["--glow"], "0.4");
        assert.equal(current.ctx.themeFile.value, "");
    }
}
checkImports().then(() => {
    console.log("clock-presets-format.test.js: passed time formatting, persistence, 12 presets, retired preset fallback, and custom theme imports");
}).catch(error => { console.error(error); process.exitCode = 1; });
