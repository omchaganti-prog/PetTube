/**
 * imageHistory.ts — Persistent cross-session image & species usage tracking.
 *
 * Stored in localStorage so cooldowns survive page refreshes.
 *
 * Image record:  timesShown | lastShownAt (ms) | lastDiscoveryCount
 * Species record: ring buffer of last SPECIES_HISTORY_SIZE species shown
 */

const LS_IMG_HISTORY_KEY     = 'pettube-img-history';
const LS_SPECIES_HISTORY_KEY = 'pettube-species-history';

/** How many recent species to remember for diversity weighting */
const SPECIES_HISTORY_SIZE = 8;

/** Minimum discoveries before an image is "off cooldown" */
export const IMAGE_COOLDOWN_DISCOVERIES = 25;

// ── Types ──────────────────────────────────────────────────────────────────

export interface ImgRecord {
  timesShown: number;
  lastShownAt: number;
  lastDiscoveryCount: number;
}

type ImgHistory = Record<string, ImgRecord>;

// ── Private cache ──────────────────────────────────────────────────────────

let _imgHistory: ImgHistory | null = null;
let _speciesHistory: string[] | null = null;

function loadImgHistory(): ImgHistory {
  if (_imgHistory) return _imgHistory;
  try {
    const raw = localStorage.getItem(LS_IMG_HISTORY_KEY);
    _imgHistory = raw ? (JSON.parse(raw) as ImgHistory) : {};
  } catch {
    _imgHistory = {};
  }
  return _imgHistory;
}

function saveImgHistory(): void {
  try {
    localStorage.setItem(LS_IMG_HISTORY_KEY, JSON.stringify(_imgHistory ?? {}));
  } catch { /* quota exceeded – silently skip */ }
}

function loadSpeciesHistory(): string[] {
  if (_speciesHistory) return _speciesHistory;
  try {
    const raw = localStorage.getItem(LS_SPECIES_HISTORY_KEY);
    _speciesHistory = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    _speciesHistory = [];
  }
  return _speciesHistory;
}

function saveSpeciesHistory(): void {
  try {
    localStorage.setItem(LS_SPECIES_HISTORY_KEY, JSON.stringify(_speciesHistory ?? []));
  } catch { /* silently skip */ }
}

// ── Public API — Images ────────────────────────────────────────────────────

/**
 * Record that an image URL was displayed.
 * @param url            The image URL that was shown.
 * @param discoveryCount The total number of species discovered at this moment.
 */
export function recordImageShown(url: string, discoveryCount: number): void {
  const h = loadImgHistory();
  const prev = h[url];
  h[url] = {
    timesShown:          (prev?.timesShown ?? 0) + 1,
    lastShownAt:         Date.now(),
    lastDiscoveryCount:  discoveryCount,
  };
  saveImgHistory();
}

/**
 * Compute a selection score for an image URL.
 * Higher score = prefer showing this image.
 *
 *  100 = never shown before (best)
 *  Penalties:
 *   -20 per previous show (strongly discourages repeated images)
 *   Up to -60 for being in the 25-discovery cooldown window
 *  Bonuses:
 *   +20 if not shown in >24 h   (time-based recovery)
 *   +30 if not shown in >7 days  (long absence bonus)
 */
export function getImageScore(url: string, currentDiscoveryCount: number): number {
  const h = loadImgHistory();
  const r = h[url];
  if (!r) return 100; // never shown — highest priority

  let score = 100;

  // Penalize repeated use
  score -= r.timesShown * 20;

  // Cooldown penalty: within IMAGE_COOLDOWN_DISCOVERIES, scale up to -60
  const discoveriesSince = currentDiscoveryCount - r.lastDiscoveryCount;
  if (discoveriesSince < IMAGE_COOLDOWN_DISCOVERIES) {
    const ratio = 1 - discoveriesSince / IMAGE_COOLDOWN_DISCOVERIES;
    score -= Math.round(ratio * 60);
  }

  // Time-based recovery bonuses
  const hoursSince = (Date.now() - r.lastShownAt) / 3_600_000;
  if (hoursSince > 168) score += 30;   // not shown in a week
  else if (hoursSince > 24) score += 20; // not shown today

  return Math.max(0, score);
}

/**
 * Returns the ImgRecord for a URL, or null if never shown.
 */
export function getImageRecord(url: string): ImgRecord | null {
  const h = loadImgHistory();
  return h[url] ?? null;
}

// ── Public API — Species ───────────────────────────────────────────────────

/**
 * Record that a species was shown.  Maintains a ring buffer of size SPECIES_HISTORY_SIZE.
 */
export function recordSpeciesShown(category: string): void {
  const h = loadSpeciesHistory();
  h.push(category);
  // Keep only the last SPECIES_HISTORY_SIZE entries
  if (h.length > SPECIES_HISTORY_SIZE) h.splice(0, h.length - SPECIES_HISTORY_SIZE);
  saveSpeciesHistory();
}

/**
 * Returns a [0, 1] weight multiplier for a species.
 * 1.0 = no penalty (not recently shown)
 * 0.0 = just shown (maximum penalty)
 *
 * The further back in the recent history ring, the smaller the penalty.
 */
export function getSpeciesDiversityMultiplier(category: string): number {
  const h = loadSpeciesHistory();
  // Find the most recent occurrence
  for (let i = h.length - 1; i >= 0; i--) {
    if (h[i] === category) {
      const recency = h.length - 1 - i; // 0 = most recent
      if (recency === 0) return 0.05;  // just shown: 95% penalty
      if (recency === 1) return 0.15;  // shown 2nd ago: 85% penalty
      if (recency === 2) return 0.30;  // shown 3rd ago
      if (recency === 3) return 0.50;  // shown 4th ago
      if (recency < SPECIES_HISTORY_SIZE) return 0.75;
    }
  }
  return 1.0; // not in recent history — full weight
}

// ── Debug / report helpers ─────────────────────────────────────────────────

/** Returns all tracked image records (used by the image report page). */
export function getAllImageRecords(): ImgHistory {
  return { ...loadImgHistory() };
}

/** Clears all persistent image and species history (dev/debug only). */
export function clearImageHistory(): void {
  _imgHistory = {};
  _speciesHistory = [];
  localStorage.removeItem(LS_IMG_HISTORY_KEY);
  localStorage.removeItem(LS_SPECIES_HISTORY_KEY);
}
