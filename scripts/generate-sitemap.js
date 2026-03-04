#!/usr/bin/env node
/**
 * generate-sitemap.js
 * -------------------
 * Generates a valid XML sitemap for https://bellatrixinc.com
 *
 * How it works:
 *  1. Tries to fetch all published page slugs from the live API.
 *  2. Falls back to a hardcoded list if the API is unreachable.
 *  3. Writes public/sitemap.xml (with XSL stylesheet) and public/robots.txt.
 *
 * Usage:
 *   node scripts/generate-sitemap.js
 *   API_URL=http://localhost:5000 node scripts/generate-sitemap.js
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Configuration ──────────────────────────────────────────
const BASE_URL = "https://bellatrixinc.com";
const API_URL = process.env.API_URL || "https://bellatrixinc.com/api";
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "..", "public");
const OUTPUT_SITEMAP = resolve(PUBLIC_DIR, "sitemap.xml");
const OUTPUT_ROBOTS = resolve(PUBLIC_DIR, "robots.txt");

// ─── Priority tiers (slug → priority + changefreq) ─────────
// Tier 1: Homepage — highest crawl priority
// Tier 2: Core service & solution pages — direct revenue pages
// Tier 3: Industry verticals & info pages — supporting content
const PAGE_META = {
  // ── Tier 1 ── Homepage
  home:                  { priority: "1.0", changefreq: "weekly" },

  // ── Tier 2 ── Core services & solutions (0.9)
  about:                 { priority: "0.9", changefreq: "monthly" },
  implementation:        { priority: "0.9", changefreq: "monthly" },
  training:              { priority: "0.9", changefreq: "monthly" },
  support:               { priority: "0.9", changefreq: "monthly" },

  // ── Tier 3 ── Industry verticals & solutions (0.8)
  hr:                    { priority: "0.8", changefreq: "monthly" },
  payroll:               { priority: "0.8", changefreq: "monthly" },
  manufacturing:         { priority: "0.8", changefreq: "monthly" },
  retail:                { priority: "0.8", changefreq: "monthly" },
  "e-invoice":           { priority: "0.8", changefreq: "monthly" },
  "professional-services": { priority: "0.8", changefreq: "monthly" },
};

// Keywords that bump unknown slugs to 0.7 (service-related content)
const SERVICE_KEYWORDS = [
  "implementation", "training", "consulting",
  "support", "netsuite", "erp", "solution",
];

// Slugs to exclude from sitemap
const EXCLUDED_PATTERNS = [/^auth/, /^admin/, /^api/];

// ─── Helpers ────────────────────────────────────────────────

const today = () => new Date().toISOString().split("T")[0];

function getMeta(slug) {
  if (PAGE_META[slug]) return PAGE_META[slug];
  if (SERVICE_KEYWORDS.some((k) => slug.includes(k))) {
    return { priority: "0.7", changefreq: "monthly" };
  }
  return { priority: "0.6", changefreq: "monthly" };
}

function isExcluded(slug) {
  return EXCLUDED_PATTERNS.some((re) => re.test(slug));
}

function buildUrlEntry(slug, lastmod) {
  const { priority, changefreq } = getMeta(slug);
  const loc = slug === "home" ? `${BASE_URL}/` : `${BASE_URL}/${slug}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildSitemap(slugs) {
  const lastmod = today();
  const entries = slugs
    .filter((s) => s && !isExcluded(s))
    .map((s) => buildUrlEntry(s, lastmod));

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.join("\n")}
</urlset>
`;
}

function buildRobotsTxt() {
  return `# Bellatrix Inc. — robots.txt
# https://bellatrixinc.com

User-agent: *
Allow: /

# Disallow admin & auth routes
Disallow: /admin
Disallow: /admin/
Disallow: /auth
Disallow: /auth/

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml
`;
}

// ─── Fetch slugs from the live API ──────────────────────────
async function fetchSlugsFromAPI() {
  const navRes = await fetch(`${API_URL}/Categories/navbar`);
  if (!navRes.ok) throw new Error(`Navbar API returned ${navRes.status}`);
  const navData = await navRes.json();

  const raw = Array.isArray(navData)
    ? navData
    : Array.isArray(navData.data)
      ? navData.data
      : Array.isArray(navData.result)
        ? navData.result
        : [];

  const slugs = new Set(["home"]);

  for (const cat of raw) {
    if (cat.mainPageSlug) slugs.add(cat.mainPageSlug);
    if (cat.slug) slugs.add(cat.slug);
    const pages = cat.pages || cat.Pages || [];
    for (const page of pages) {
      if (page.slug) slugs.add(page.slug);
    }
  }

  return [...slugs];
}

// ─── Main ───────────────────────────────────────────────────
async function main() {
  let slugs;

  try {
    console.log(`📡  Fetching page slugs from ${API_URL} …`);
    slugs = await fetchSlugsFromAPI();
    console.log(`✅  Found ${slugs.length} pages from API`);
  } catch (err) {
    console.error(`❌  API unreachable (${err.message}). Cannot generate sitemap without API.`);
    process.exit(1);
  }

  // Sort: home first, then by priority descending, then alphabetical
  slugs.sort((a, b) => {
    if (a === "home") return -1;
    if (b === "home") return 1;
    // Sort by priority descending, then alphabetical
    const pa = parseFloat(getMeta(a).priority);
    const pb = parseFloat(getMeta(b).priority);
    if (pb !== pa) return pb - pa;
    return a.localeCompare(b);
  });

  const validSlugs = slugs.filter((s) => !isExcluded(s));

  // Write sitemap.xml
  const xml = buildSitemap(slugs);
  writeFileSync(OUTPUT_SITEMAP, xml, "utf-8");

  // Write robots.txt
  const robots = buildRobotsTxt();
  writeFileSync(OUTPUT_ROBOTS, robots, "utf-8");

  // Summary
  const tiers = {
    "1.0": 0, "0.9": 0, "0.8": 0, "0.7": 0, "0.6": 0,
  };
  for (const s of validSlugs) {
    const p = getMeta(s).priority;
    tiers[p] = (tiers[p] || 0) + 1;
  }

  console.log(`\n🗺️   Sitemap written → ${OUTPUT_SITEMAP}`);
  console.log(`🤖  Robots.txt written → ${OUTPUT_ROBOTS}`);
  console.log(`\n   The Total URLs: ${validSlugs.length}`);
  console.log(`    ┌─────────────────────────────────────┐`);
  console.log(`    │  Priority 1.0 (Homepage)    : ${tiers["1.0"]}     │`);
  console.log(`    │  Priority 0.9 (Core pages)  : ${tiers["0.9"]}     │`);
  console.log(`    │  Priority 0.8 (Verticals)   : ${tiers["0.8"]}     │`);
  console.log(`    │  Priority 0.7 (Related)     : ${tiers["0.7"]}     │`);
  console.log(`    │  Priority 0.6 (Other)       : ${tiers["0.6"]}     │`);
  console.log(`    └─────────────────────────────────────┘`);
  console.log(`    Last modified: ${today()}\n`);
}

main().catch((err) => {
  console.error("❌  Sitemap generation failed:", err);
  process.exit(1);
});
