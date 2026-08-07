"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const projectRoot = path.resolve(__dirname, "..");
const sitemapPath = path.join(projectRoot, "sitemap.xml");
const robotsPath = path.join(projectRoot, "robots.txt");
const manifestPath = path.join(projectRoot, "site.webmanifest");
const siteOrigin = "https://linearclocklab.com";
const siteRoot = `${siteOrigin}/`;
const expectedHomepageCardHrefs = [
    "multi-clock.html",
    "clock_presets.html",
    "task-planner-lc.html",
    "timer.html",
    "stopwatch.html",
    "time-calculator.html",
    "date-calculator.html",
    "time-zone-converter.html",
    "focus.html",
    "todo.html",
    "dashboard.html",
    "about.html"
];
const requiredCalculatorLocations = [
    `${siteRoot}time-calculator.html`,
    `${siteRoot}date-calculator.html`,
    `${siteRoot}time-zone-converter.html`
];
const migratedTimePages = new Set([
    "index.html",
    "clock.html",
    "multi-clock.html",
    "clock_presets.html",
    "focus.html",
    "stopwatch.html",
    "timer.html",
    "time-calculator.html",
    "time-zone-converter.html",
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

check(
    fs.existsSync(robotsPath) && fs.statSync(robotsPath).isFile(),
    "robots.txt",
    "must exist as a public crawler policy",
    fs.existsSync(robotsPath) ? "not a file" : "missing"
);
if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, "utf8");
    check(
        /^User-agent:\s*\*\s*$/im.test(robots),
        "robots.txt",
        "must define the default crawler group",
        "User-agent: * missing"
    );
    check(
        /^Allow:\s*\/\s*$/im.test(robots),
        "robots.txt",
        "must allow the public site root",
        "Allow: / missing"
    );
    check(
        !/^Disallow:\s*\/\s*$/im.test(robots),
        "robots.txt",
        "must not block the entire site",
        "Disallow: / found"
    );
    check(
        new RegExp(`^Sitemap:\\s*${escapeRegExp(siteRoot)}sitemap\\.xml\\s*$`, "im").test(robots),
        "robots.txt",
        "must advertise the production sitemap URL",
        "production Sitemap directive missing"
    );
}

check(
    fs.existsSync(manifestPath) && fs.statSync(manifestPath).isFile(),
    "site.webmanifest",
    "must exist",
    fs.existsSync(manifestPath) ? "not a file" : "missing"
);
if (fs.existsSync(manifestPath)) {
    let manifest = null;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch (error) {
        fail("site.webmanifest", "must contain valid JSON", error.message);
    }
    if (manifest) {
        check(manifest.name === "Linear Clock Lab", "site.webmanifest", "name must match the site", manifest.name);
        check(manifest.start_url === "/", "site.webmanifest", "start_url must target the site root", manifest.start_url);
        check(manifest.scope === "/", "site.webmanifest", "scope must cover the site root", manifest.scope);
        check(manifest.background_color === "#000000", "site.webmanifest", "background must match dark mode", manifest.background_color);
        check(manifest.theme_color === "#000000", "site.webmanifest", "theme must match dark mode", manifest.theme_color);
        check(
            typeof manifest.description === "string" && manifest.description.trim().length > 0,
            "site.webmanifest",
            "must contain a human-readable description",
            manifest.description
        );
        const manifestIcons = Array.isArray(manifest.icons) ? manifest.icons : [];
        check(
            manifestIcons.length > 0,
            "site.webmanifest",
            "must contain at least one icon",
            `${manifestIcons.length} found`
        );
        for (const icon of manifestIcons) {
            const asset = resolveLocalAsset("index.html", icon.src || "");
            check(
                Boolean(asset) && !asset.error && fs.existsSync(asset.path),
                "site.webmanifest",
                "icon target must exist locally",
                icon.src
            );
        }
    }
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

for (const location of requiredCalculatorLocations) {
    check(
        uniqueLocations.has(location),
        "sitemap.xml",
        "must include every current calculator/converter page",
        `${location} missing`
    );
}

const publicPageFiles = new Set(publicPages.map(({ pageFile }) => pageFile));
const rootHtmlFiles = fs.readdirSync(projectRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".html"))
    .map((entry) => entry.name)
    .sort();
for (const pageFile of rootHtmlFiles) {
    check(
        publicPageFiles.has(pageFile),
        "sitemap.xml",
        "must include every root-level public HTML page",
        `${pageFile} missing`
    );
}
check(
    publicPageFiles.size === rootHtmlFiles.length,
    "sitemap.xml",
    "must contain no obsolete or non-HTML page entries",
    `${publicPageFiles.size} sitemap pages and ${rootHtmlFiles.length} root HTML files`
);

const homepage = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
const homepageCards = [
    ...homepage.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)
].filter((match) => {
    const classes = getAttribute(match[0], "class");
    return classes && classes.split(/\s+/).includes("card");
});
const homepageCardHrefs = homepageCards.map((card) => getAttribute(card[0], "href"));
check(
    homepageCardHrefs.length === expectedHomepageCardHrefs.length,
    "index.html",
    "must contain exactly twelve tool cards",
    `${homepageCardHrefs.length} found`
);
check(
    JSON.stringify(homepageCardHrefs) === JSON.stringify(expectedHomepageCardHrefs),
    "index.html",
    "tool cards must retain the documented source order",
    homepageCardHrefs.join(", ")
);
check(
    new Set(homepageCardHrefs).size === homepageCardHrefs.length,
    "index.html",
    "tool cards must not contain duplicate destinations",
    homepageCardHrefs.join(", ")
);
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

const homepageLinkedLocations = new Set(
    [...homepage.matchAll(/<a\b([^>]*)>/gi)]
        .map((match) => getAttribute(match[0], "href"))
        .filter((href) => href && staticLocalReference(href))
        .map((href) => {
            try {
                return new URL(href, siteRoot).href;
            } catch {
                return null;
            }
        })
        .filter(Boolean)
);
for (const { location, pageFile } of publicPages) {
    if (pageFile === "index.html") continue;
    check(
        homepageLinkedLocations.has(location),
        "index.html",
        "must link every public spoke from the hub",
        `${pageFile} is not discoverable from index.html`
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

const pageTitles = new Map();
const pageDescriptions = new Map();

for (const { location, pageFile, pagePath } of publicPages) {
    const html = fs.readFileSync(pagePath, "utf8");
    check(
        /^\s*<!doctype\s+html\s*>/i.test(html),
        pageFile,
        "must start with an HTML5 doctype",
        "doctype missing or malformed"
    );
    check(
        getOpeningTags(html, "html").length === 1 &&
            (html.match(/<\/html\s*>/gi) || []).length === 1,
        pageFile,
        "must contain one complete html element",
        `${getOpeningTags(html, "html").length} opening and ${(html.match(/<\/html\s*>/gi) || []).length} closing tags`
    );
    check(
        getOpeningTags(html, "body").length === 1 &&
            (html.match(/<\/body\s*>/gi) || []).length === 1,
        pageFile,
        "must contain one complete body element",
        `${getOpeningTags(html, "body").length} opening and ${(html.match(/<\/body\s*>/gi) || []).length} closing tags`
    );
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
    const iconTags = getLinkTags(head, "icon");
    const appleTouchIconTags = getLinkTags(head, "apple-touch-icon");
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
        ["favicon", iconTags],
        ["apple-touch-icon", appleTouchIconTags],
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

    const title = titleTags.length === 1
        ? visibleText(titleTags[0])
        : "";
    const description = descriptionTags.length === 1
        ? decodeEntities(getAttribute(descriptionTags[0], "content") || "").trim()
        : "";
    const robotsContent = robotsTags.length === 1
        ? (getAttribute(robotsTags[0], "content") || "").toLowerCase()
        : "";
    check(title.length > 0, pageFile, "title must contain readable text", JSON.stringify(title));
    check(
        description.length >= 50 && description.length <= 200,
        pageFile,
        "description must be concise and human-readable",
        `${description.length} characters`
    );
    check(
        !/\bnoindex\b/.test(robotsContent) &&
            /\bindex\b/.test(robotsContent) &&
            /\bfollow\b/.test(robotsContent),
        pageFile,
        "robots meta must allow indexing and following",
        robotsContent
    );
    if (title) {
        const duplicate = pageTitles.get(title);
        check(!duplicate, pageFile, "title must be unique", duplicate || title);
        pageTitles.set(title, pageFile);
    }
    if (description) {
        const duplicate = pageDescriptions.get(description);
        check(!duplicate, pageFile, "description must be unique", duplicate || description);
        pageDescriptions.set(description, pageFile);
    }

    const h1Tags = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1\s*>/gi) || [];
    check(
        h1Tags.length === 1,
        pageFile,
        "must contain exactly one primary H1",
        `${h1Tags.length} found`
    );
    if (h1Tags.length === 1) {
        check(
            visibleText(h1Tags[0]).length > 0,
            pageFile,
            "primary H1 must contain readable text",
            JSON.stringify(visibleText(h1Tags[0]))
        );
    }

    for (const [label, tags] of [
        ["favicon", iconTags],
        ["apple-touch-icon", appleTouchIconTags]
    ]) {
        if (tags.length !== 1) continue;
        check(
            getAttribute(tags[0], "href") === `${siteRoot}profile.png`,
            pageFile,
            `${label} must use the production profile image`,
            getAttribute(tags[0], "href")
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

    for (const tag of getOpeningTags(html, "a")) {
        const reference = getAttribute(tag, "href");
        if (!reference) continue;
        const target = resolveLocalAsset(pageFile, reference);
        if (!target) continue;
        if (target.error) {
            fail(pageFile, "anchor href must be a valid local reference", target.error);
            continue;
        }
        check(
            fs.existsSync(target.path),
            pageFile,
            "local anchor target must exist",
            `${reference} resolves to ${target.relative}`
        );
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

    if (pageFile === "date-calculator.html") {
        const scriptBlocks = [
            ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)
        ];
        const dateScripts = scriptBlocks.filter((match) => {
            const src = getAttribute(match[0], "src");
            if (!src) return false;
            const local = staticLocalReference(src);
            return local
                ? local.replace(/^\.?\//, "").toLowerCase() === "lcl-date.js"
                : false;
        });
        check(
            dateScripts.length === 1,
            pageFile,
            "must load lcl-date.js exactly once",
            `${dateScripts.length} references found`
        );
        const dateController = scriptBlocks.find(
            (match) =>
                !getAttribute(match[0], "src") &&
                /\bLCLDate\b/.test(match[2])
        );
        check(
            Boolean(dateController),
            pageFile,
            "must contain an inline controller that uses LCLDate",
            dateController ? "controller found" : "controller not found"
        );
        const dateTabs = getOpeningTags(html, "button").filter(
            (tag) => getAttribute(tag, "role") === "tab"
        );
        check(
            dateTabs.length === 5,
            pageFile,
            "must expose five calculator mode tabs",
            `${dateTabs.length} role=tab buttons found`
        );
        check(
            !/new\s+Date\s*\(\s*["']/.test(html),
            pageFile,
            "must not parse date-only strings through the Date constructor",
            "string Date constructor found"
        );
        if (dateScripts.length === 1 && dateController) {
            check(
                dateScripts[0].index < dateController.index,
                pageFile,
                "lcl-date.js must load before the date calculator controller",
                `shared script at ${dateScripts[0].index}, controller at ${dateController.index}`
            );
        }
    }

    if (pageFile === "multi-clock.html") {
        const scriptBlocks = [
            ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)
        ];
        const selectorScripts = scriptBlocks.filter((match) => {
            const src = getAttribute(match[0], "src");
            if (!src) return false;
            const local = staticLocalReference(src);
            return local
                ? local.replace(/^\.?\//, "").toLowerCase() ===
                    "lcl-timezone-select.js"
                : false;
        });
        const multiClockController = scriptBlocks.find(
            (match) =>
                !getAttribute(match[0], "src") &&
                /\bLCLTimeZoneSelect\b/.test(match[2])
        );
        check(
            selectorScripts.length === 1,
            pageFile,
            "must load lcl-timezone-select.js exactly once",
            `${selectorScripts.length} references found`
        );
        check(
            Boolean(multiClockController),
            pageFile,
            "must consume the shared timezone selector API",
            multiClockController ? "controller found" : "controller not found"
        );
        check(
            !/function\s+(?:getOffsetMinutes|fmtOffset|zonePrettyName|getAllTimeZones|dedupeZones)\b|const\s+(?:pinnedZones|majorCityKeepList)\b/.test(html),
            pageFile,
            "must not retain page-local timezone selector data helpers",
            "obsolete selector helper found"
        );
        if (selectorScripts.length === 1 && multiClockController) {
            check(
                selectorScripts[0].index < multiClockController.index,
                pageFile,
                "shared selector utility must load before the Multi-Clock controller",
                `selector script at ${selectorScripts[0].index}, controller at ${multiClockController.index}`
            );
        }
    }

    if (pageFile === "time-zone-converter.html") {
        const scriptBlocks = [
            ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)
        ];
        const scriptsNamed = (fileName) => scriptBlocks.filter((match) => {
            const src = getAttribute(match[0], "src");
            if (!src) return false;
            const local = staticLocalReference(src);
            return local
                ? local.replace(/^\.?\//, "").toLowerCase() === fileName
                : false;
        });
        const dateScripts = scriptsNamed("lcl-date.js");
        const selectorScripts = scriptsNamed("lcl-timezone-select.js");
        const timezoneScripts = scriptsNamed("lcl-timezone.js");
        const converterController = scriptBlocks.find(
            (match) =>
                !getAttribute(match[0], "src") &&
                /\bLCLTimeZoneSelect\b/.test(match[2]) &&
                /\bLCLTimeZone\b/.test(match[2]) &&
                /\bLCLDate\b/.test(match[2]) &&
                /\bLCLTime\b/.test(match[2])
        );
        check(
            dateScripts.length === 1,
            pageFile,
            "must load lcl-date.js exactly once",
            `${dateScripts.length} references found`
        );
        check(
            selectorScripts.length === 1,
            pageFile,
            "must load lcl-timezone-select.js exactly once",
            `${selectorScripts.length} references found`
        );
        check(
            timezoneScripts.length === 1,
            pageFile,
            "must load lcl-timezone.js exactly once",
            `${timezoneScripts.length} references found`
        );
        check(
            Boolean(converterController),
            pageFile,
            "must contain an inline controller using all four shared APIs",
            converterController ? "controller found" : "controller not found"
        );
        const zoneSelects = getOpeningTags(html, "select").filter(
            (tag) => ["source-zone", "destination-zone"].includes(
                getAttribute(tag, "id")
            )
        );
        check(
            zoneSelects.length === 2,
            pageFile,
            "must expose native From and To timezone dropdowns",
            `${zoneSelects.length} matching selects found`
        );
        check(
            !/<datalist\b|Type a city or IANA identifier/i.test(html),
            pageFile,
            "must not retain the obsolete manual-entry datalist UI",
            "obsolete datalist markup or helper text found"
        );
        check(
            /id=["']swap-button["']/i.test(html),
            pageFile,
            "must expose the instant-preserving Swap action",
            "swap-button not found"
        );
        check(
            !/new\s+Date\s*\(\s*["']/.test(html),
            pageFile,
            "must not parse wall-clock strings through the Date constructor",
            "string Date constructor found"
        );
        if (
            dateScripts.length === 1 &&
            selectorScripts.length === 1 &&
            timezoneScripts.length === 1 &&
            converterController
        ) {
            check(
                dateScripts[0].index < converterController.index &&
                    selectorScripts[0].index < converterController.index &&
                    timezoneScripts[0].index < converterController.index,
                pageFile,
                "shared date, selector, and timezone utilities must load before the controller",
                `date script at ${dateScripts[0].index}, selector script at ${selectorScripts[0].index}, timezone script at ${timezoneScripts[0].index}, controller at ${converterController.index}`
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
