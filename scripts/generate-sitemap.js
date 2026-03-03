#!/usr/bin/env node
/**
 * generate-sitemap.js
 * -------------------
 * Generates a valid XML sitemap for https://bellatrixinc.com
 *
 * How it works:
 *  1. Tries to fetch all published page slugs from the live API.
 *  2. Falls back to a hardcoded list if the API is unreachable.
 *  3. Writes public/sitemap.xml so it's served at the site root after deploy.
 *
 * Usage:
 *   node scripts/generate-sitemap.js          (uses production API)
 *   API_URL=http://localhost:5000 node scripts/generate-sitemap.js  (local dev)
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Configuration ──────────────────────────────────────────
const BASE_URL = "https://bellatrixinc.com";
const API_URL = process.env.API_URL || "https://bellatrixinc.com/api";
const OUTPUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "sitemap.xml"
);

// Priority & change-frequency per slug pattern
const PRIORITY_MAP = {
  home: { priority: "1.0", changefreq: "weekly" },
  about: { priority: "0.8", changefreq: "monthly" },
  _service: { priority: "0.8", changefreq: "monthly" }, // any service page
  _default: { priority: "0.6", changefreq: "monthly" },
};

// Guaranteed fallback slugs (known pages from the component map)
const FALLBACK_SLUGS = [
  "home",
  "about",
  "hr",
  "payroll",
  "implementation",
  "training",
  "customization",
  "support",
  "manufacturing",
  "retail",
  "netsuite-consulting",
  "integration",
];

// Slugs that should never appear in the sitemap
const EXCLUDED_PATTERNS = [/^auth/, /^admin/, /^api/];

// ─── Helpers ────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0]; // YYYY-MM-DD

function getMeta(slug) {
  if (PRIORITY_MAP[slug]) return PRIORITY_MAP[slug];
  // Service-level pages get higher priority
  const serviceKeywords = [
    "implementation",
    "training",
    "consulting",
    "customization",
    "support",
    "integration",
  ];
  if (serviceKeywords.some((k) => slug.includes(k))) {
    return PRIORITY_MAP._service;
  }
  return PRIORITY_MAP._default;
}

function isExcluded(slug) {
  return EXCLUDED_PATTERNS.some((re) => re.test(slug));
}

function buildUrlEntry(slug, lastmod) {
  const { priority, changefreq } = getMeta(slug);
  const loc = slug === "home" ? BASE_URL : `${BASE_URL}/${slug}`;
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
}

// ─── Fetch slugs from the live API ──────────────────────────
async function fetchSlugsFromAPI() {
  // Strategy 1: Fetch from /Categories/navbar (returns categories with nested pages)
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

  const slugs = new Set(["home"]); // always include home

  for (const cat of raw) {
    // Category main page
    if (cat.mainPageSlug) slugs.add(cat.mainPageSlug);
    if (cat.slug) slugs.add(cat.slug);
    // Nested pages
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
    console.warn(`⚠️  API unreachable (${err.message}). Using fallback slugs.`);
    slugs = FALLBACK_SLUGS;
  }

  // Merge fallback slugs so known pages are always present
  const merged = [...new Set([...slugs, ...FALLBACK_SLUGS])];
  // Sort: home first, then alphabetical
  merged.sort((a, b) => {
    if (a === "home") return -1;
    if (b === "home") return 1;
    return a.localeCompare(b);
  });

  const xml = buildSitemap(merged);
  writeFileSync(OUTPUT, xml, "utf-8");

  console.log(`\n🗺️   Sitemap written to ${OUTPUT}`);
  console.log(`    ${merged.filter((s) => !isExcluded(s)).length} URLs included`);
  console.log(`    Homepage priority: 1.0`);
  console.log(`    Last modified: ${today()}\n`);
}

main().catch((err) => {
  console.error("❌  Sitemap generation failed:", err);
  process.exit(1);
});
