/**
 * imagePool.ts — Curated quality image supply for species-accurate animal photos.
 *
 *  Quality Architecture:
 *   Tier 1 – Wikipedia REST API with hand-curated, priority-ordered article shots
 *             Each shot has type (baby/funny/wholesome/…) and quality score 1–10
 *             Priority order: baby > funny > wholesome > expression > family >
 *                             playful > beauty > portrait > action > standard
 *             Validation: skip SVG diagrams, require min 150×150 px thumbnails
 *
 *   Tier 2 – Dedicated free animal APIs (supplemental dog/cat variety)
 *             Dogs → dog.ceo  |  Cats → thecatapi.com
 *
 *   Tier 3 – LoremFlickr keyword fallback (last resort / pool-empty)
 *
 *  Duplicate prevention: session-level Set<string> — same URL never shown twice.
 */

import { ANIMAL_REGISTRY } from '../data/animalRegistry';
import { CURATED_SHOTS, shotPriority } from '../data/curatedShots';
import type { AnimalCategory } from '../types';
import { recordImageShown, getImageScore } from '../utils/imageHistory';

// ---------------------------------------------------------------------------
// Priority-sorted shot lists per species (computed once at module load)
// ---------------------------------------------------------------------------

const sortedShots = Object.fromEntries(
  ANIMAL_REGISTRY.map((e) => {
    const shots = CURATED_SHOTS[e.id] ?? [];
    return [e.id, [...shots].sort((a, b) => shotPriority(b) - shotPriority(a))];
  }),
);

// LoremFlickr fallback keywords from registry
const LF_KEYWORDS: Record<string, string> = Object.fromEntries(
  ANIMAL_REGISTRY.map((e) => [e.id, e.keyword]),
);

// ---------------------------------------------------------------------------
// Session-level deduplication — same URL never shown twice per session
// ---------------------------------------------------------------------------

const seenUrls = new Set<string>();

// ---------------------------------------------------------------------------
// Tier 1 – Wikipedia REST API (with quality validation)
// ---------------------------------------------------------------------------

async function fetchWikiThumbnail(article: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(article)}`,
      { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(7000) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      thumbnail?: { source: string; width: number; height: number };
    };
    const t = data.thumbnail;
    if (!t) return null;
    // Reject SVG (diagrams/maps) and images below minimum quality size
    if (t.source.toLowerCase().endsWith('.svg')) return null;
    if (t.width < 150 || t.height < 150) return null;
    return t.source;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Tier 2 – Dedicated dog / cat APIs
// ---------------------------------------------------------------------------

async function fetchDogApiImages(count: number): Promise<string[]> {
  try {
    const res = await fetch(
      `https://dog.ceo/api/breeds/image/random/${count}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { status: string; message: string[] };
    return data.status === 'success' ? data.message : [];
  } catch {
    return [];
  }
}

async function fetchCatApiImages(count: number): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${count}&size=med`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { url: string }[];
    return Array.isArray(data) ? data.map((c) => c.url) : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Tier 3 – LoremFlickr species keyword fallback
// ---------------------------------------------------------------------------

const lfCounters: Record<string, number> = Object.fromEntries(
  ANIMAL_REGISTRY.map((e) => [e.id, Math.floor(Math.random() * 800) + 1]),
);

function loremFlickrUrl(category: AnimalCategory): string {
  const keyword = LF_KEYWORDS[category] ?? category.replace(/-/g, '');
  const lock = (lfCounters[category] ?? 1);
  lfCounters[category] = lock + 1;
  return `https://loremflickr.com/500/500/${keyword}?lock=${lock}`;
}

// ---------------------------------------------------------------------------
// Internal FIFO pool per category
// ---------------------------------------------------------------------------

const pool: Record<string, string[]> = Object.fromEntries(
  ANIMAL_REGISTRY.map((e) => [e.id, []]),
);

let warmUpDone = false;
let warmUpInFlight: Promise<void> | null = null;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Call once on app mount. Fills the pool in priority order (idempotent).
 * Best shots (baby, funny, wholesome) are fetched first and land at the front
 * of each species pool so the first image shown is always the highest quality.
 */
export async function warmUpPool(): Promise<void> {
  if (warmUpDone) return;
  if (warmUpInFlight) return warmUpInFlight;

  warmUpInFlight = (async () => {
    const tasks: Promise<void>[] = [];

    // Tier 1: curated, priority-sorted Wikipedia thumbnails for every species
    for (const entry of ANIMAL_REGISTRY) {
      const shots = sortedShots[entry.id] ?? [];
      tasks.push(
        // Fetch all shots in parallel; results arrive in same order as shots array
        Promise.allSettled(shots.map((s) => fetchWikiThumbnail(s.article))).then((results) => {
          // Filter nulls — the remaining URLs are already in priority order
          const urls = results
            .filter((r): r is PromiseFulfilledResult<string | null> => r.status === 'fulfilled')
            .map((r) => r.value)
            .filter((u): u is string => u !== null);
          if (urls.length > 0) pool[entry.id].push(...urls);
        }),
      );
    }

    // Tier 2: supplemental dog / cat images appended at end of pool (lower priority)
    tasks.push(
      fetchDogApiImages(20).then((urls) => { if (urls.length > 0) pool.dogs.push(...urls); }),
      fetchCatApiImages(15).then((urls) => { if (urls.length > 0) pool.cats.push(...urls); }),
    );

    await Promise.allSettled(tasks);
    warmUpDone = true;
  })();

  return warmUpInFlight;
}

/**
 * Returns the next species-accurate image URL.
 *
 * Selection strategy:
 *  1. Filter out URLs already seen this session.
 *  2. Score remaining candidates using persistent image history.
 *     - Never-seen URLs score 100 (highest priority)
 *     - Recently shown or high-repeat URLs score lower
 *  3. Pick the highest-scoring candidate.
 *  4. Fall through to LoremFlickr when the pool is empty.
 *
 * @param category       Species category
 * @param discoveryCount Total species discovered so far (for cooldown calculation)
 */
export function getImageUrl(category: AnimalCategory, discoveryCount = 0): string {
  const catPool = pool[category];
  if (catPool && catPool.length > 0) {
    // Collect unseen candidates
    const candidates = catPool.filter(url => !seenUrls.has(url));

    if (candidates.length > 0) {
      // Score all candidates using persistent history; pick highest
      const scored = candidates.map(url => ({
        url,
        score: getImageScore(url, discoveryCount),
      }));
      scored.sort((a, b) => b.score - a.score);

      const winner = scored[0].url;
      // Remove winner from pool so it won't be picked again this session
      const idx = catPool.indexOf(winner);
      if (idx !== -1) catPool.splice(idx, 1);

      seenUrls.add(winner);
      recordImageShown(winner, discoveryCount);
      return winner;
    }

    // All pool entries already seen this session — clear seen set for this category
    // so the next session can show them again, and fall through to LoremFlickr
    catPool.forEach(url => seenUrls.delete(url));
  }

  // Pool exhausted — LoremFlickr fallback (always unique due to incrementing lock)
  const url = loremFlickrUrl(category);
  seenUrls.add(url);
  recordImageShown(url, discoveryCount);
  return url;
}

/** Returns a fresh fallback URL when an image fails to load in a card. */
export function getFallbackUrl(category: AnimalCategory): string {
  return getImageUrl(category);
}

/** Returns the number of curated images available (pre-warmup) for a category. */
export function getCuratedCount(category: AnimalCategory): number {
  return (CURATED_SHOTS[category] ?? []).length;
}

/** Returns the live pool size (images fetched but not yet shown) for a category. */
export function getPoolSize(category: AnimalCategory): number {
  return pool[category]?.length ?? 0;
}
