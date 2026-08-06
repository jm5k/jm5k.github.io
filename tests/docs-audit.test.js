"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(projectRoot, file), "utf8");
const readDoc = (file) => read(file);
const sitemap = read("sitemap.xml");
const readme = readDoc("README.md");
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

console.log(`docs-audit.test.js: passed ${publicPages.length} public-page and documentation contracts`);
