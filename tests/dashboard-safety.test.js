"use strict";

// Execute actual page functions and handlers using recording DOM/storage doubles.
// This checks data boundaries without launching a browser or executing payloads.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const html = fs.readFileSync(path.join(__dirname, "../dashboard.html"), "utf8").replace(/\r\n/g, "\n");
function between(start, end) {
    const first = html.indexOf(start);
    const last = html.indexOf(end, first + start.length);
    assert.ok(first >= 0 && last > first, `Source boundaries: ${start}`);
    return html.slice(first, last);
}
function method(name, next) { return between(`        function ${name}(`, `        function ${next}(`); }
class Node {
    constructor() { this.style = {}; this.dataset = {}; this.children = new Map(); this.events = {}; this.classList = { add() {} }; }
    set innerHTML(value) { this.markup = value; }
    querySelector(selector) {
        if (!this.children.has(selector)) this.children.set(selector, new Node());
        return this.children.get(selector);
    }
    addEventListener(name, fn) { this.events[name] = fn; }
}
const controls = new Map();
const writes = [];
const alerts = [];
let saved = null;
let failWrite = false;
let renders = 0;
let prompts = [];
const ctx = {
    URL,
    document: {
        baseURI: "https://linearclocklab.com/dashboard.html",
        createElement: () => new Node(),
        getElementById(id) { if (!controls.has(id)) controls.set(id, new Node()); return controls.get(id); }
    },
    settings: { locked: false }, STORAGE_KEY: "lcl_dashboard_v4",
    localStorage: {
        getItem: () => saved,
        setItem(key, value) { if (failWrite) throw Error("Storage unavailable"); writes.push([key, value]); saved = value; }
    },
    state: null,
    alert: (message) => alerts.push(message),
    prompt: () => prompts.shift(),
    initialRender: () => { renders++; },
    modelById: (id) => ctx.state.tiles.find((tile) => tile.id === id)
};
vm.createContext(ctx);
vm.runInContext(
    method("saveState", "validateTileUrl") +
    method("validateTileUrl", "validateTile") + method("validateTile", "validateLayout") +
    method("validateLayout", "loadState") + method("loadState", "saveSettings") +
    method("buildTile", "addTile") +
    between('        document\n          .getElementById("importFile")', '        // Kickoff'), ctx);
const tile = { id: "one", title: "Clock", url: "clock.html", x: 20, y: 20, w: 640, h: 300 };
for (const url of ["clock.html", "/timer.html", "./clock.html?mode=test#rail", "https://example.com/", "http://localhost:8000/clock.html"]) {
    assert.equal(ctx.validateTileUrl(url), url);
}
for (const url of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,test", "file:///C:/test.html", "blob:https://example.com/id", "about:blank", "java\nscript:alert(1)", "https://[", "", null]) {
    assert.throws(() => ctx.validateTileUrl(url), undefined, `Reject ${url}`);
}
for (const patch of [{ x: -1 }, { y: NaN }, { w: 0 }, { h: Infinity }, { x: "20" }, { title: "" }, { id: "" }]) {
    assert.throws(() => ctx.validateLayout({ tiles: [{ ...tile, ...patch }] }));
}
assert.throws(() => ctx.validateLayout({ tiles: [tile, tile] }), /unique/);
assert.throws(() => ctx.validateLayout({ tiles: [null] }));
assert.equal(ctx.validateLayout({ tiles: [] }).tiles.length, 0);

const payload = '<img src=x onerror="void(0)">';
const literal = { ...tile, title: payload };
const rendered = ctx.buildTile(literal);
assert.ok(!rendered.markup.includes(payload), "title never enters HTML markup");
assert.equal(rendered.querySelector(".tile-title").textContent, payload);
assert.equal(rendered.querySelector(".tile-title").title, payload);
assert.equal(rendered.querySelector("iframe").title, payload);
assert.equal(rendered.querySelector("iframe").src, "clock.html");
assert.throws(() => ctx.buildTile({ ...tile, url: "javascript:alert(1)" }));

ctx.state = { tiles: [{ ...tile }] };
const edited = ctx.buildTile(ctx.state.tiles[0]);
const edit = () => edited.querySelector(".tile-actions").events.click({ target: { closest: () => ({ dataset: { action: "edit" } }) } });
prompts = ["Changed", "javascript:alert(1)"];
edit();
assert.equal(ctx.state.tiles[0].title, "Clock");
assert.equal(ctx.state.tiles[0].url, "clock.html");
assert.equal(writes.length, 0, "rejected edit does not persist");
prompts = [payload, "timer.html"];
edit();
assert.equal(edited.querySelector(".tile-title").textContent, payload);
assert.equal(edited.querySelector("iframe").src, "timer.html");

async function importLayout(data) {
    const target = { files: [{ text: async () => JSON.stringify(data) }], value: "file.json" };
    await controls.get("importFile").events.change({ target });
    assert.equal(target.value, "");
}
(async () => {
    const current = ctx.state;
    const writesBefore = writes.length;
    await importLayout({ tiles: [tile, { ...tile, id: "two", url: "javascript:alert(1)" }] });
    assert.equal(ctx.state, current);
    assert.equal(writes.length, writesBefore, "whole invalid import rejected before persistence");
    assert.equal(renders, 0);
    failWrite = true;
    await importLayout({ tiles: [literal] });
    assert.equal(ctx.state, current, "failed persistence does not replace active layout");
    failWrite = false;
    await importLayout({ tiles: [literal] });
    assert.equal(ctx.state.tiles[0].title, payload);
    assert.equal(renders, 1);
    assert.equal(JSON.parse(saved).tiles[0].url, "clock.html");
    assert.equal(ctx.loadState().tiles[0].title, payload, "valid saved layout reloads unchanged");
    saved = JSON.stringify({ tiles: [{ ...tile, url: "data:text/html,unsafe" }] });
    const unsafeSaved = saved;
    assert.equal(ctx.loadState(), null, "unsafe saved layout is not rendered");
    assert.equal(saved, unsafeSaved, "load does not overwrite existing stored data");
    assert.ok(alerts.some((message) => message.startsWith("Import failed:")));
    console.log("dashboard-safety.test.js: passed literal rendering, URL/schema validation, edit/import rejection, and saved-state checks");
})().catch((error) => { console.error(error); process.exitCode = 1; });
