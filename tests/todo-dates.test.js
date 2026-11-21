"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const LCLDate = require("../lcl-date.js");
const source = fs.readFileSync(path.join(__dirname, "../todo.js"), "utf8").replace(/\r\n/g, "\n");
function method(name, next) {
    const first = source.indexOf(`  function ${name}(`);
    const last = source.indexOf(`  function ${next}(`, first + 1);
    assert.ok(first >= 0 && last > first, `Source boundaries: ${name}`);
    return source.slice(first, last);
}
const ctx = {
    LCLDate, Date, tasks: [], currentPlanner: "work", hideCompletedMap: {},
    generateId: () => "task", normalizeCategoryId: (category) => category,
    getNextOrderIndex: () => 1, saveState() {}, renderAll() {},
    getDefaultHideCompletedMap: () => ({ now: false, next: false, planned: false, backburner: false })
};
vm.createContext(ctx);
vm.runInContext(
    method("normalizeDateString", "getTodayYMD") +
    method("normalizeTasksForImport", "buildExportPayload") +
    method("buildExportPayload", "exportToJson") +
    method("normalizeImportedData", "importFromJson") +
    method("addTask", "deleteTask") + method("changeDueDate", "changeNotes"), ctx);

const priorZone = process.env.TZ;
try {
    for (const zone of ["America/New_York", "America/Los_Angeles", "UTC", "Pacific/Kiritimati", "Pacific/Apia"]) {
        process.env.TZ = zone;
        for (const date of ["2026-11-21", "2026-03-08", "2026-11-01", "2024-02-29", "2000-02-29", "2011-12-30", "0001-01-01", "9999-12-31"]) {
            assert.equal(ctx.normalizeDateString(date), date, `${zone}: ${date}`);
        }
        for (const invalid of ["2026-02-29", "1900-02-29", "2100-02-29", "2026-04-31", "2026-13-01", "0000-01-01", "not a date", "", null]) {
            assert.equal(ctx.normalizeDateString(invalid), null);
        }
        const legacyLocalDate = zone === "America/New_York" || zone === "America/Los_Angeles"
            ? "2026-11-20" : "2026-11-21";
        assert.equal(ctx.normalizeDateString("2026-11-21T00:00:00Z"), legacyLocalDate);
        assert.equal(ctx.normalizeDateString(legacyLocalDate), legacyLocalDate);
        assert.equal(ctx.normalizeDateString("2026-02-30T00:00:00Z"), null);
        ctx.tasks = [];
        ctx.addTask("Example", "now", "2026-11-21");
        assert.equal(ctx.tasks[0].dueDate, "2026-11-21", `${zone}: creation`);
        ctx.changeDueDate("task", "2026-11-22");
        assert.equal(ctx.tasks[0].dueDate, "2026-11-22", `${zone}: edit`);
        ctx.tasks[0].notes = "Keep my note";
        ctx.tasks[0].pinned = true;
        for (let cycle = 0; cycle < 10; cycle++) {
            const exported = JSON.parse(JSON.stringify(ctx.buildExportPayload()));
            assert.equal(exported.tasks[0].dueDate, "2026-11-22");
            assert.equal(exported.tasks[0].dueDateISO, "2026-11-22");
            ctx.tasks = ctx.normalizeImportedData(exported).tasks;
            assert.equal(ctx.tasks[0].dueDate, "2026-11-22", `${zone}: backup cycle ${cycle}`);
            assert.equal(ctx.tasks[0].notes, "Keep my note");
            assert.equal(ctx.tasks[0].pinned, true);
        }
        for (const legacy of [
            [{ dueDate: "2026-11-21" }],
            { tasks: [{ dueDateISO: "2026-11-21" }] },
            { state: { tasks: [{ dueDate: "2026-11-21" }] } }
        ]) assert.equal(ctx.normalizeImportedData(legacy).tasks[0].dueDate, "2026-11-21");
    }
} finally {
    if (priorZone === undefined) delete process.env.TZ;
    else process.env.TZ = priorZone;
}
const html = fs.readFileSync(path.join(__dirname, "../todo.html"), "utf8");
const dateScript = html.indexOf('src="lcl-date.js" defer');
const todoScript = html.indexOf('src="todo.js" defer');
assert.ok(dateScript >= 0 && todoScript > dateScript, "date API loads before controller");
console.log("todo-dates.test.js: passed creation/editing, legacy shapes, invalid dates, and 10 backup cycles in five time zones");
