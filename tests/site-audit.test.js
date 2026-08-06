"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const projectRoot = path.resolve(__dirname, "..");
const sitemapPath = path.join(projectRoot, "sitemap.xml");
const siteOrigin = "https://linearclocklab.com";
const siteRoot = `${siteOrigin}/`;
const migratedTimePages = new Set([
    "index.html",
    "clock.html",
    "multi-clock.html",
    "clock_presets.html",
    "focus.html",
    "stopwatch.html",
    "timer.html",
    "time-calculator.html",
    "task-planner-lc.html"
]);
const requiredSocialMetadata = [
    ["property", "og:type"],
    ["property", "og:title"],
    ["property", "og:description"],
    ["property", "og:url"],
    ["property", "og:image"],
    ["name", "twitter:card"],
    ["name", "twitter:title"],
    ["name", "twitter:description"],
    ["name", "twitter:image"]
];
const failures = [];

function fail(scope, rule, actual) {
    failures.push(`${scope}: ${rule}; actual: ${actual}`);
}

function check(condition, scope, rule, actual) {
    if (!condition) fail(scope, rule, actual);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getAttribute(tag, name) {
    const attributePattern = new RegExp(
        `\\b${escapeRegExp(name)}\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s\"'=<>]+))`,
        "i"
    );
    const match = tag.match(attributePattern);
    return match ? match[1] ?? match[2] ?? match[3] : null;
}

function getOpeningTags(html, tagName) {
    return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) || [];
}

function getMetaTags(head, attributeName, attributeValue) {
    return getOpeningTags(head, "meta").filter((tag) => {
        const value = getAttribute(tag, attributeName);
        return value && value.toLowerCase() === attributeValue.toLowerCase();
    });
}

function getLinkTags(head, relation) {
    return getOpeningTags(head, "link").filter((tag) => {
        const value = getAttribute(tag, "rel");
        return value
            ? value.toLowerCase().split(/\s+/).includes(relation.toLowerCase())
            : false;
    });
}

function decodeEntities(value) {
    return value
        .replace(/&larr;/gi, "\u2190")
        .replace(/&copy;/gi, "\u00a9")
        .replace(/&ndash;/gi, "\u2013")
        .replace(/&mdash;/gi, "\u2014")
        .replace(/&middot;/gi, "\u00b7")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, "\"")
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
            String.fromCodePoint(Number.parseInt(hex, 16))
        )
        .replace(/&#([0-9]+);/g, (_, decimal) =>
            String.fromCodePoint(Number.parseInt(decimal, 10))
        );
}

function visibleText(html) {
    return decodeEntities(
        html
            .replace(/<!--[\s\S]*?-->/g, " ")
            .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
            .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
            .replace(/<[^>]+>/g, " ")
    )
        .replace(/\s+/g, " ")
        .trim();
}

function localFileForSitemapUrl(location) {
    let parsed;
    try {
        parsed = new URL(location);
    } catch {
        return null;
    }

    if (parsed.origin !== siteOrigin || parsed.search || parsed.hash) return null;
    if (parsed.pathname === "/") return "index.html";
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
}

function staticLocalReference(reference) {
    const trimmed = reference.trim();
    if (
        !trimmed ||
        /^(?:https?:|mailto:|data:|#|\/\/)/i.test(trimmed)
    ) {
        return null;
    }
    return trimmed.split(/[?#]/, 1)[0];
}

function resolveLocalAsset(pageFile, reference) {
    const localReference = staticLocalReference(reference);
    if (!localReference) return null;

    let decoded;
    try {
        decoded = decodeURIComponent(localReference);
    } catch {
        return { error: `invalid URL encoding in ${reference}` };
    }

    const resolved = decoded.startsWith("/")
        ? path.resolve(projectRoot, `.${decoded}`)
        : path.resolve(projectRoot, path.dirname(pageFile), decoded);
    const relative = path.relative(projectRoot, resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
        return { error: `reference escapes repository root: ${reference}` };
    }
    return { path: resolved, relative };
}

const sitemap = fs.readFileSync(sitemapPath, "utf8");
check(
    /<urlset\b[^>]*>[\s\S]*<\/urlset\s*>/i.test(sitemap),
    "sitemap.xml",
    "must contain a complete urlset",
    "urlset missing or malformed"
);

const locOpenCount = (sitemap.match(/<loc\b[^>]*>/gi) || []).length;
const locCloseCount = (sitemap.match(/<\/loc\s*>/gi) || []).length;
check(
    locOpenCount > 0 && locOpenCount === locCloseCount,
    "sitemap.xml",
    "must contain balanced, non-empty loc elements",
    `${locOpenCount} opening and ${locCloseCount} closing loc tags`
);

const sitemapLocations = [...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi)]
    .map((match) => decodeEntities(match[1]).trim());
const uniqueLocations = new Set(sitemapLocations);
check(
    uniqueLocations.size === sitemapLocations.length,
    "sitemap.xml",
    "must not contain duplicate loc values",
    `${sitemapLocations.length - uniqueLocations.size} duplicate(s)`
);

const publicPages = [];
for (const location of sitemapLocations) {
    check(
        location.startsWith(siteRoot),
        "sitemap.xml",
        "loc must use the Linear Clock Lab HTTPS root",
        location
    );
    const pageFile = localFileForSitemapUrl(location);
    check(
        pageFile !== null,
        "sitemap.xml",
        "loc must map to a root-site path without query or fragment",
        location
    );
    if (!pageFile) continue;
    check(
        pageFile.toLowerCase().endsWith(".html"),
        "sitemap.xml",
        "loc must map to an HTML file",
        pageFile
    );
    const pagePath = path.join(projectRoot, pageFile);
    check(
        fs.existsSync(pagePath) && fs.statSync(pagePath).isFile(),
        "sitemap.xml",
        "loc target must exist",
        pageFile
    );
    if (fs.existsSync(pagePath)) {
        publicPages.push({ location, pageFile, pagePath });
    }
}

const homepage = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
const homepageCards = [
    ...homepage.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)
].filter((match) => {
    const classes = getAttribute(match[0], "class");
    return classes && classes.split(/\s+/).includes("card");
});
for (const card of homepageCards) {
    const href = getAttribute(card[0], "href");
    if (!href || !staticLocalReference(href)) continue;
    let cardLocation;
    try {
        cardLocation = new URL(href, siteRoot).href;
    } catch {
        fail("index.html", "tool-card href must be a valid URL", href);
        continue;
    }
    check(
        uniqueLocations.has(cardLocation),
        "index.html",
        "tool-card target must appear in sitemap.xml",
        `${href} resolves to ${cardLocation}`
    );
}

const julianDatePages = ["index.html", "clock.html", "clock_presets.html"];
for (const pageFile of julianDatePages) {
    const html = fs.readFileSync(path.join(projectRoot, pageFile), "utf8");
    const julianIdCount = (html.match(/\bid\s*=\s*["']julianDate["']/gi) || []).length;
    check(
        julianIdCount === 1,
        pageFile,
        "must contain exactly one julianDate element",
        `${julianIdCount} found`
    );
    check(
        !/Julian date:/i.test(visibleText(html)),
        pageFile,
        "must not visibly contain the redundant Julian date prefix",
        "Julian date: found in static visible text"
    );
}

for (const pageFile of ["index.html", "clock.html"]) {
    const html = fs.readFileSync(path.join(projectRoot, pageFile), "utf8");
    const julianElement = getOpeningTags(html, "div").find(
        (tag) => getAttribute(tag, "id") === "julianDate"
    );
    check(
        getAttribute(julianElement || "", "aria-label") ===
            "Julian date in ordinal YYYY-DDD format",
        pageFile,
        "must retain the ordinal Julian-date accessible label",
        getAttribute(julianElement || "", "aria-label")
    );
}

const presetThemesHtml = fs.readFileSync(
    path.join(projectRoot, "clock_presets.html"),
    "utf8"
);
check(
    /<div class="stats"[^>]*>[\s\S]*?<div>Time left:[\s\S]*?<\/div>\s*<div\b[^>]*aria-label="Ordinal Julian date in YYYY-DDD format"[^>]*>[\s\S]*?<b id="julianDate"/i.test(
        presetThemesHtml
    ),
    "clock_presets.html",
    "must retain the Julian value after Time left with an accessible label",
    "statistics-row Julian item missing or misplaced"
);

for (const { location, pageFile, pagePath } of publicPages) {
    const html = fs.readFileSync(pagePath, "utf8");
    const headMatches = [...html.matchAll(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/gi)];
    check(
        headMatches.length === 1,
        pageFile,
        "must contain exactly one complete head",
        `${headMatches.length} found`
    );
    if (headMatches.length !== 1) continue;
    const head = headMatches[0][1];
    const metaTags = getOpeningTags(head, "meta");
    const titleTags = head.match(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi) || [];
    const charsetTags = metaTags.filter((tag) => getAttribute(tag, "charset"));
    const viewportTags = getMetaTags(head, "name", "viewport");
    const descriptionTags = getMetaTags(head, "name", "description");
    const authorTags = getMetaTags(head, "name", "author");
    const robotsTags = getMetaTags(head, "name", "robots");
    const themeTags = getMetaTags(head, "name", "theme-color");
    const colorSchemeTags = getMetaTags(head, "name", "color-scheme");
    const canonicalTags = getLinkTags(head, "canonical");
    const ogUrlTags = getMetaTags(head, "property", "og:url");
    const lclCssTags = getOpeningTags(head, "link").filter((tag) => {
        const href = getAttribute(tag, "href");
        if (!href) return false;
        const local = staticLocalReference(href);
        return local
            ? local.replace(/^\.?\//, "").toLowerCase() === "lcl.css"
            : false;
    });

    for (const [label, tags] of [
        ["charset", charsetTags],
        ["viewport", viewportTags],
        ["title", titleTags],
        ["description", descriptionTags],
        ["author", authorTags],
        ["robots meta", robotsTags],
        ["canonical", canonicalTags],
        ["theme-color", themeTags],
        ["color-scheme", colorSchemeTags],
        ["lcl.css reference", lclCssTags],
        ["og:url", ogUrlTags]
    ]) {
        check(
            tags.length === 1,
            pageFile,
            `must contain exactly one ${label}`,
            `${tags.length} found`
        );
    }

    for (const [attributeName, attributeValue] of requiredSocialMetadata) {
        const tags = getMetaTags(head, attributeName, attributeValue);
        check(
            tags.length === 1,
            pageFile,
            `must contain exactly one ${attributeValue}`,
            `${tags.length} found`
        );
    }

    const canonical =
        canonicalTags.length === 1
            ? decodeEntities(getAttribute(canonicalTags[0], "href") || "")
            : "";
    const ogUrl =
        ogUrlTags.length === 1
            ? decodeEntities(getAttribute(ogUrlTags[0], "content") || "")
            : "";
    if (canonical) {
        check(
            canonical === location,
            pageFile,
            "canonical must match sitemap URL",
            canonical
        );
        check(
            !/(?:\{\{|\}\}|\{%|%\})/.test(canonical),
            pageFile,
            "canonical must not contain a template expression",
            canonical
        );
    }
    if (ogUrl) {
        check(
            ogUrl === location,
            pageFile,
            "og:url must match sitemap URL",
            ogUrl
        );
        check(
            ogUrl === canonical,
            pageFile,
            "og:url must match canonical",
            ogUrl
        );
        check(
            !/(?:\{\{|\}\}|\{%|%\})/.test(ogUrl),
            pageFile,
            "og:url must not contain a template expression",
            ogUrl
        );
    }

    const backLinks = [
        ...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)
    ].filter((match) => {
        const classes = getAttribute(match[0], "class");
        return classes && classes.split(/\s+/).includes("lcl-back-link");
    });
    const expectedBackLinks = pageFile === "index.html" ? 0 : 1;
    check(
        backLinks.length === expectedBackLinks,
        pageFile,
        pageFile === "index.html"
            ? "must not contain an lcl-back-link"
            : "must contain exactly one lcl-back-link",
        `${backLinks.length} found`
    );
    if (backLinks.length === 1 && pageFile !== "index.html") {
        const backLink = backLinks[0][0];
        const backText = visibleText(backLinks[0][2]);
        check(
            getAttribute(backLink, "href") === "index.html",
            pageFile,
            "back link href must be index.html",
            getAttribute(backLink, "href")
        );
        check(
            getAttribute(backLink, "aria-label") ===
                "Back to Linear Clock Lab",
            pageFile,
            "back link aria-label must match suite standard",
            getAttribute(backLink, "aria-label")
        );
        check(
            getAttribute(backLink, "title") === "Back to Linear Clock Lab",
            pageFile,
            "back link title must match suite standard",
            getAttribute(backLink, "title")
        );
        check(
            backText === "\u2190",
            pageFile,
            "back link visible content must be a left arrow only",
            JSON.stringify(backText)
        );
    }

    const pageVisibleText = visibleText(html);
    const copyright = "\u00a9 2025\u20132026 jm5k";
    const copyrightCount = pageVisibleText.split(copyright).length - 1;
    check(
        copyrightCount === 1,
        pageFile,
        "must visibly contain exactly one current copyright",
        `${copyrightCount} occurrences of ${copyright}`
    );
    check(
        !/\u00a9\s*2025(?!\s*[\u2013-]\s*2026)\s*jm5k/i.test(pageVisibleText),
        pageFile,
        "must not visibly contain a 2025-only jm5k copyright",
        "legacy copyright found"
    );

    for (const [tagName, attributeName] of [
        ["link", "href"],
        ["script", "src"],
        ["img", "src"]
    ]) {
        for (const tag of getOpeningTags(html, tagName)) {
            const reference = getAttribute(tag, attributeName);
            if (!reference) continue;
            const asset = resolveLocalAsset(pageFile, reference);
            if (!asset) continue;
            if (asset.error) {
                fail(pageFile, `${tagName} asset reference must be valid`, asset.error);
                continue;
            }
            check(
                fs.existsSync(asset.path),
                pageFile,
                `${tagName} local asset must exist`,
                `${reference} resolves to ${asset.relative}`
            );
        }
    }

    if (migratedTimePages.has(pageFile)) {
        const scriptBlocks = [
            ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)
        ];
        const sharedScripts = scriptBlocks.filter((match) => {
            const src = getAttribute(match[0], "src");
            if (!src) return false;
            const local = staticLocalReference(src);
            return local
                ? local.replace(/^\.?\//, "").toLowerCase() === "lcl-time.js"
                : false;
        });
        check(
            sharedScripts.length === 1,
            pageFile,
            "must load lcl-time.js exactly once",
            `${sharedScripts.length} references found`
        );
        const controller = scriptBlocks.find(
            (match) => !getAttribute(match[0], "src") && /\bLCLTime\b/.test(match[2])
        );
        check(
            Boolean(controller),
            pageFile,
            "must contain an inline controller that uses LCLTime",
            controller ? "controller found" : "controller not found"
        );
        if (sharedScripts.length === 1 && controller) {
            check(
                sharedScripts[0].index < controller.index,
                pageFile,
                "lcl-time.js must load before the controller that uses LCLTime",
                `shared script at ${sharedScripts[0].index}, controller at ${controller.index}`
            );
        }
    }

    if (pageFile === "time-calculator.html") {
        const scriptBlocks = [
            ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)
        ];
        const durationScripts = scriptBlocks.filter((match) => {
            const src = getAttribute(match[0], "src");
            if (!src) return false;
            const local = staticLocalReference(src);
            return local
                ? local.replace(/^\.?\//, "").toLowerCase() === "lcl-duration.js"
                : false;
        });
        check(
            durationScripts.length === 1,
            pageFile,
            "must load lcl-duration.js exactly once",
            `${durationScripts.length} references found`
        );
        const calculatorController = scriptBlocks.find(
            (match) =>
                !getAttribute(match[0], "src") &&
                /\bLCLDuration\b/.test(match[2])
        );
        check(
            Boolean(calculatorController),
            pageFile,
            "must contain an inline controller that uses LCLDuration",
            calculatorController ? "controller found" : "controller not found"
        );
        const durationSelectorCount = getOpeningTags(html, "select").filter(
            (tag) => /\bdata-duration-units(?:\s|=|>)/i.test(tag)
        ).length;
        check(
            durationSelectorCount === 5,
            pageFile,
            "must source all five duration selectors from LCLDuration.units",
            `${durationSelectorCount} data-duration-units attributes found`
        );
        check(
            Boolean(calculatorController) &&
                /\bLCLDuration\.units\b/.test(calculatorController[2]),
            pageFile,
            "calculator controller must populate selectors from LCLDuration.units",
            "LCLDuration.units use not found"
        );
        if (durationScripts.length === 1 && calculatorController) {
            check(
                durationScripts[0].index < calculatorController.index,
                pageFile,
                "lcl-duration.js must load before the calculator controller",
                `shared script at ${durationScripts[0].index}, controller at ${calculatorController.index}`
            );
        }
    }
}

if (failures.length) {
    console.error(`Site audit failed: ${failures.length} issue(s).`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
} else {
    console.log(
        `Site audit passed: ${publicPages.length} public pages, metadata, navigation, copyright, sitemap, and assets verified.`
    );
}
