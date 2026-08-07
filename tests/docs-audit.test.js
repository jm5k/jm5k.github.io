"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(projectRoot, file), "utf8");
const readDoc = (file) => read(file);
const sitemap = read("sitemap.xml");
const readme = readDoc("README.md");
const changelog = readDoc("CHANGELOG.md");
const documentationFiles = [
    "README.md",
    "agents.md",
    "ARCHITECTURE.md",
    "COMPONENTS.md",
    "UI_RULES.md",
    "about.html"
];
const documentation = Object.fromEntries(
    documentationFiles.map((file) => [file, readDoc(file)])
);

const publicPages = [...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi)]
    .map((match) => match[1].trim())
    .map((location) => {
        const pathname = new URL(location).pathname;
        return pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
    });

for (const page of publicPages) {
    assert.ok(readme.includes(page), `README.md must mention ${page}`);
}

for (const testFile of [
    "tests/time-utils.test.js",
    "tests/duration-utils.test.js",
    "tests/date-utils.test.js",
    "tests/timezone-utils.test.js",
    "tests/timezone-select-utils.test.js",
    "tests/site-audit.test.js",
    "tests/docs-audit.test.js"
]) {
    assert.ok(readme.includes(testFile), `README.md must mention ${testFile}`);
}

for (const staleClaim of [
    /lap tracking/i,
    /unified navigation bar/i,
    /© 2025-2026/
]) {
    assert.doesNotMatch(readme, staleClaim);
}

for (const [file, contents] of Object.entries(documentation)) {
    assert.doesNotMatch(contents, /\bAGENTS\.md\b/, `${file} must use agents.md`);
}

for (const file of ["agents.md", "COMPONENTS.md", "UI_RULES.md"]) {
    assert.doesNotMatch(
        documentation[file],
        /Do not add a copyright notice/i,
        `${file} must require the public copyright notice`
    );
}

for (const file of ["agents.md", "ARCHITECTURE.md", "COMPONENTS.md", "UI_RULES.md"]) {
    assert.match(documentation[file], /\.lcl-back-link/, `${file} must document .lcl-back-link`);
    assert.match(documentation[file], /&larr;/, `${file} must use the left-arrow entity in navigation examples`);
    assert.doesNotMatch(documentation[file], /←\s*Home/, `${file} must not use the old visible Home link`);
}

assert.match(documentation["agents.md"], /keywords are optional/i);
assert.match(documentation["ARCHITECTURE.md"], /keywords\s*\(optional\)|keywords are optional/i);

for (const file of ["agents.md", "COMPONENTS.md", "UI_RULES.md"]) {
    assert.match(
        documentation[file],
        /LocalStorage keys are compatibility contracts/i,
        `${file} must document LocalStorage compatibility contracts`
    );
}

for (const file of ["agents.md", "ARCHITECTURE.md", "COMPONENTS.md", "UI_RULES.md"]) {
    assert.match(documentation[file], /desktop-first/i, `${file} must state the desktop-first direction`);
}

assert.ok(readme.includes("© 2025–2026 jm5k"), "README.md must use the current copyright");
assert.match(readme, /nanoseconds through decades/i);
assert.match(readme, /365\.2425 days/i);
assert.match(readme, /marked approximate/i);
assert.match(readme, /clamp-to-valid-date/i);
assert.match(readme, /date-only/i);
assert.match(readme, /IANA time zones/i);
assert.match(readme, /DST gaps/i);
assert.match(readme, /ambiguous fall-back times/i);
assert.match(readme, /lcl-timezone-select\.js/i);
assert.match(readme, /pinned/i);
assert.match(readme, /python -m http\.server 8000/i);
assert.match(readme, /desktop-first/i);
assert.match(readme, /robots\.txt/i);

const currentToolNames = [
    "Task Planner Linear Clock",
    "Multi-Clock",
    "Clock Colors",
    "FocusLine",
    "Stopwatch",
    "Timer",
    "Time Calculator",
    "Date Calculator",
    "Time Zone Converter",
    "Dashboard",
    "To Do Lists"
];
for (const toolName of currentToolNames) {
    assert.match(
        documentation["about.html"],
        new RegExp(`>${toolName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<`, "i"),
        `about.html must include a ${toolName} section`
    );
    assert.match(readme, new RegExp(toolName, "i"), `README.md must mention ${toolName}`);
}

for (const page of publicPages) {
    assert.ok(
        documentation["COMPONENTS.md"].includes(page),
        `COMPONENTS.md must map ${page} to its component pattern`
    );
}

assert.doesNotMatch(
    documentation["ARCHITECTURE.md"],
    /future Date\s+Calculator/i,
    "ARCHITECTURE.md must describe Date Calculator as implemented"
);
assert.match(documentation["ARCHITECTURE.md"], /Multi-Clock builds these groups for the current\s+instant/i);
assert.match(documentation["ARCHITECTURE.md"], /Time Zone Converter rebuilds them from the resolved conversion instant/i);
assert.match(documentation["UI_RULES.md"], /minmax\(230px, 1fr\)/i);
assert.match(documentation["UI_RULES.md"], /four\s+columns/i);
assert.match(documentation["UI_RULES.md"], /Multi-Clock,[\s\S]*Clock Colors,[\s\S]*Task Planner Clock,[\s\S]*Timer/i);

for (const recentChange of [
    "Add Practical Time Calculator",
    "Expand Duration Unit Range",
    "Add Exact Date Calculator",
    "Add Time Zone Converter",
    "Share Timezone Selector Data",
    "Reorder Home Tool Grid"
]) {
    assert.ok(changelog.includes(recentChange), `CHANGELOG.md must retain ${recentChange}`);
}

console.log(`docs-audit.test.js: passed ${publicPages.length} public-page and documentation contracts`);
