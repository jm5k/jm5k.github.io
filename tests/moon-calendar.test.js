"use strict";

// Controller unit tests with an in-memory DOM surface; no browser or server.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const LCLMoon = require("../lcl-moon.js");
const html = fs.readFileSync(path.join(__dirname, "../moon-phases.html"), "utf8");
const controller = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
let clock = new Date(2026, 10, 21, 12).getTime();
class TestDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
}
let document;
class Element {
    constructor(tag) {
        this.tag = tag;
        this.children = [];
        this.dataset = {};
        this.attributes = {};
        this.listeners = {};
        this.value = "";
    }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    removeAttribute(name) { delete this.attributes[name]; }
    appendChild(child) { this.children.push(child); child.parent = this; return child; }
    replaceChildren(fragment) {
        this.children = fragment.children;
        for (const child of this.children) child.parent = this;
    }
    addEventListener(name, callback) { this.listeners[name] = callback; }
    matches(selector) {
        if (selector === "button") return this.tag === "button";
        const match = selector.match(/^\[data-month="(\d+)"\]\[data-day="(\d+)"\]$/);
        return Boolean(match && String(this.dataset.month) === match[1] && String(this.dataset.day) === match[2]);
    }
    closest(selector) { return this.matches(selector) ? this : this.parent?.closest(selector); }
    querySelector(selector) { return descendants(this).find((element) => element.matches(selector)) || null; }
    contains(element) { return descendants(this).includes(element); }
    focus() {
        document.activeElement = this;
        for (let ancestor = this.parent; ancestor; ancestor = ancestor.parent) {
            ancestor.listeners.focusin?.({ target: this });
        }
    }
    get valueAsNumber() { return this.value === "" ? NaN : Number(this.value); }
}
function descendants(element) {
    return element.children.flatMap((child) => [child, ...descendants(child)]);
}
const elements = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)]
    .map((match) => [match[1], new Element("div")]));
document = {
    activeElement: null,
    getElementById: (id) => elements[id],
    createElement: (tag) => new Element(tag),
    createDocumentFragment: () => new Element("fragment"),
    createTextNode: (text) => Object.assign(new Element("text"), { textContent: text })
};
let refresh;
vm.runInNewContext(controller, {
    document, Date: TestDate, Intl, LCLMoon,
    setInterval: (callback) => { refresh = callback; }
}, { filename: "moon-phases.html" });
const calendar = elements["moon-calendar"];
const buttons = () => descendants(calendar).filter((element) => element.tag === "button");
const cell = (month, day) => calendar.querySelector(`[data-month="${month}"][data-day="${day}"]`);
const click = (id) => elements[id].listeners.click();
function showYear(year) {
    elements["calendar-year"].value = String(year);
    elements["year-form"].listeners.submit({ preventDefault() {} });
}
assert.equal(Number(elements["calendar-year"].value), 2026);
assert.equal(calendar.children.length, 31);
assert.equal(buttons().length, 365);
assert.equal(buttons().filter((button) => button.tabIndex === 0).length, 1);
assert.equal(cell(10, 21).getAttribute("aria-current"), "date");
assert.match(elements["day-detail"].textContent, /Waxing gibbous/);
assert.equal(elements["moon-legend"].children.length, 8);
click("previous-year");
assert.equal(Number(elements["calendar-year"].value), 2025);
click("next-year");
assert.equal(Number(elements["calendar-year"].value), 2026);
for (const [year, count] of [[2024, 366], [1900, 365], [2000, 366], [2100, 365]]) {
    showYear(year);
    assert.equal(buttons().length, count, `calendar days for ${year}`);
    assert.equal(Boolean(cell(1, 29)), count === 366);
    assert.equal(cell(3, 31), null);
}
assert.equal(elements["next-year"].disabled, true);
showYear(1900);
assert.equal(elements["previous-year"].disabled, true);
for (const bad of [1899, 2101, 2026.5, ""]) {
    showYear(bad);
    assert.equal(elements["calendar-year"].getAttribute("aria-invalid"), "true");
    assert.equal(buttons().length, 365, "invalid year leaves existing calendar intact");
}
click("current-year");
assert.equal(Number(elements["calendar-year"].value), 2026);
assert.equal(elements["calendar-year"].getAttribute("aria-invalid"), null);
function key(button, value) {
    calendar.listeners.keydown({ target: button, key: value, preventDefault() {} });
}
cell(2, 31).focus();
key(cell(2, 31), "ArrowLeft");
assert.equal(document.activeElement, cell(1, 28), "March 31 clamps to February 28");
key(cell(1, 28), "Home");
assert.equal(document.activeElement, cell(1, 1));
key(cell(1, 1), "ArrowUp");
assert.equal(document.activeElement, cell(1, 1));
key(cell(1, 1), "End");
assert.equal(document.activeElement, cell(1, 28));
assert.equal(buttons().filter((button) => button.tabIndex === 0).length, 1);
clock = new Date(2026, 10, 22, 12).getTime();
refresh();
assert.equal(cell(10, 21).getAttribute("aria-current"), null);
assert.equal(cell(10, 22).getAttribute("aria-current"), "date");
assert.equal(document.activeElement, cell(1, 28), "midnight refresh preserves keyboard position");
console.log("moon-calendar.test.js: passed year controls, leap days, bounds, keyboard navigation, and date rollover");
