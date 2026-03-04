/**
 * contentService.ts
 *
 * Purpose: Fetch, cache, and serve industry-specific regulatory content from
 * the Cloudflare R2 CDN. This content enriches assessment results with
 * jurisdiction-aware citations and action items — displayed in the PDF export
 * and the in-app Blind Spots list for US-based organizations.
 *
 * Architecture overview:
 *   1. On launch, initContentService() fetches manifest.json from R2, which
 *      lists available industry content files and their current versions.
 *   2. Each industry file is fetched and cached in SQLite (content_cache table)
 *      so the app works offline after first load.
 *   3. getIndustryContext(industry, questionId) does a fast in-memory lookup
 *      — no async required at render time.
 *   4. Industry content is ADDITIVE — it appears below generic action text and
 *      only when response.value !== 0 (i.e., a governance gap exists).
 *
 * Adding a new industry:
 *   1. Write the industry JSON file and upload it to R2 (see docs/cdn-content/).
 *   2. Add the industry to manifest.json on R2 and bump the manifest version.
 *   3. Add the Industry enum display name → CDN key mapping to INDUSTRY_CDN_KEYS below.
 *   Sessions are broken out two industries at a time to manage content quality.
 *
 * Current content coverage (as of session 22, 2026-03-02):
 *   - Energy & Utilities  (v1.0.0)
 *   - Healthcare          (v1.0.0)
 *   - Financial Services  (v1.0.0) ← added this session
 *   - Technology          (v1.0.0) ← added this session
 *   Planned: Manufacturing, Government, Retail & E-Commerce, Telecommunications
 */

import { getCachedContent, setCachedContent, getAllCachedByPrefix } from './db';

// Set VITE_CONTENT_CDN_URL in .env.local before production build.
const CDN_BASE =
  (import.meta.env.VITE_CONTENT_CDN_URL as string | undefined) ??
  'https://pub-18fdaa9defa54790ad7c5afe3df9ff2d.r2.dev';

const MANIFEST_URL = `${CDN_BASE}/industry-regulations/manifest.json`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IndustryRegulation {
  citation: string;
  action: string;
}

interface IndustryContent {
  version: string;
  industry: string;
  regulations: Record<string, IndustryRegulation>;
}

interface ManifestEntry {
  version: string;
  url: string;
}

interface Manifest {
  version: string;
  industries: Record<string, ManifestEntry>;
}

// ─── In-memory cache ──────────────────────────────────────────────────────────

const _memCache: Record<string, IndustryContent> = {};
let _manifestVersion: string | null = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, ms = 5000): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

async function fetchAndCacheIndustry(industry: string, entry: ManifestEntry): Promise<void> {
  const cacheKey = `industry-regulations/${industry}`;
  const cached = await getCachedContent(cacheKey);

  if (cached?.version === entry.version) {
    try { _memCache[industry] = JSON.parse(cached.data) as IndustryContent; } catch { /* corrupt cache */ }
    return;
  }

  try {
    const url = `${CDN_BASE}${entry.url.startsWith('/') ? '' : '/'}${entry.url}`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const content: IndustryContent = await res.json();
    await setCachedContent(cacheKey, JSON.stringify(content), entry.version);
    _memCache[industry] = content;
  } catch {
    // Network error — fall back to stale cache if available
    if (cached) {
      try { _memCache[industry] = JSON.parse(cached.data) as IndustryContent; } catch { /* corrupt */ }
    }
  }
}

async function loadAllFromCache(): Promise<void> {
  const rows = await getAllCachedByPrefix('industry-regulations/');
  for (const row of rows) {
    const industry = row.key.replace('industry-regulations/', '');
    try { _memCache[industry] = JSON.parse(row.data) as IndustryContent; } catch { /* corrupt */ }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch the content manifest from CDN, update any stale industry files in
 * SQLite, and populate the in-memory lookup cache.
 *
 * Called once at app launch (after initDatabase). Fails silently — if CDN is
 * unreachable, the app loads from the last cached versions. If nothing is
 * cached, getIndustryContext() returns null and generic action text is shown.
 */
export async function initContentService(): Promise<void> {
  try {
    const res = await fetchWithTimeout(MANIFEST_URL);
    if (!res.ok) throw new Error(`Manifest HTTP ${res.status}`);
    const manifest: Manifest = await res.json();
    _manifestVersion = manifest.version;
    await Promise.all(
      Object.entries(manifest.industries).map(([industry, entry]) =>
        fetchAndCacheIndustry(industry, entry)
      )
    );
  } catch {
    // CDN unreachable — load whatever is cached locally
    await loadAllFromCache();
  }
}

/**
 * Look up industry-specific regulatory context for a question.
 * Returns null if the industry is not cached or the question has no entry.
 * Callers should only invoke this when response.value !== 0 (gap exists).
 */
export function getIndustryContext(
  industry: string,
  questionId: string
): IndustryRegulation | null {
  return _memCache[industry]?.regulations[questionId] ?? null;
}

/**
 * Returns the manifest version string last fetched from CDN.
 * Used for content version locking when saving completed assessments.
 */
export function getCurrentContentVersion(): string | null {
  return _manifestVersion;
}

// ─── Industry CDN Key Map ─────────────────────────────────────────────────────
//
// Maps the Industry enum display value (from src/types/assessment.ts) to the
// CDN content key used to fetch and cache the industry's regulation file.
//
// IMPORTANT: The key here must exactly match the Industry enum's string value.
// The CDN key must match the filename on R2 (e.g., 'financial-services' maps
// to industry-regulations/financial-services.json on R2).
//
// Only add an entry here AFTER the corresponding JSON file has been uploaded
// to R2 and the manifest.json has been updated. If a key is present but the
// manifest doesn't list it, no content will load (manifest drives fetching).
const INDUSTRY_CDN_KEYS: Record<string, string> = {
  // Phase D (session 20): first two industries
  'Energy & Utilities': 'energy-utilities',
  'Healthcare':         'healthcare',
  // Phase D continued (session 22): financial services and technology
  'Financial Services': 'financial-services',
  'Technology':         'technology',
  // Phase D continued (session 24): manufacturing
  'Manufacturing':         'manufacturing',
  // Planned — add entries below as content files are published to R2:
  // 'Government':          'government',
  // 'Retail & E-Commerce': 'retail-ecommerce',
  // 'Telecommunications':  'telecommunications',
};

/**
 * Converts an Industry enum value (e.g. "Energy & Utilities") to the
 * CDN key used to look up cached content (e.g. "energy-utilities").
 * Returns null if no content file has been published for this industry.
 */
export function industryToCdnKey(industry: string): string | null {
  return INDUSTRY_CDN_KEYS[industry] ?? null;
}
