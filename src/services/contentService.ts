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
