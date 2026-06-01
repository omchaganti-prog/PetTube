/**
 * pitySystem.ts — Frustration-prevention pity counters for the rarity system.
 *
 * Tracks how many discoveries have passed since the player last found each
 * rarity tier. After a threshold, the weight for that tier is boosted linearly
 * up to a maximum multiplier, so unlucky players gradually get luckier.
 *
 * Rules:
 *  - Rare pity  : applies if no rare+ found after PITY_CONFIG.rare.start  pulls
 *  - Epic pity  : applies if no epic+ found after PITY_CONFIG.epic.start  pulls
 *  - Exotic pity: applies if no exotic+ found after PITY_CONFIG.exotic.start pulls
 *  - Legendary  : NEVER boosted — it must remain an extraordinary event
 *
 * Counters are persisted in localStorage so they survive page reloads.
 */

import type { Rarity } from '../types';
import { LS_PITY_KEY, PITY_CONFIG } from '../constants';

// ---------------------------------------------------------------------------
// State schema
// ---------------------------------------------------------------------------

export interface PityCounters {
  /** Discoveries since last rare-or-better was found */
  sinceRare: number;
  /** Discoveries since last epic-or-better was found */
  sinceEpic: number;
  /** Discoveries since last exotic-or-better was found */
  sinceExotic: number;
}

const DEFAULTS: PityCounters = { sinceRare: 0, sinceEpic: 0, sinceExotic: 0 };

// ---------------------------------------------------------------------------
// Numeric tier ordering (higher = rarer)
// ---------------------------------------------------------------------------

const TIER: Record<Rarity, number> = {
  common: 1, uncommon: 2, rare: 3, epic: 4, exotic: 5, legendary: 6,
};

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function load(): PityCounters {
  try {
    const raw = localStorage.getItem(LS_PITY_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<PityCounters>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(state: PityCounters): void {
  try {
    localStorage.setItem(LS_PITY_KEY, JSON.stringify(state));
  } catch { /* storage full — silently ignore */ }
}

// ---------------------------------------------------------------------------
// Pity multiplier calculation
// ---------------------------------------------------------------------------

/**
 * Returns a weight multiplier (≥ 1.0) for a given tier.
 * Interpolates linearly from 1.0 at `start` discoveries up to `maxBonus` at `max`.
 */
function multiplier(counter: number, tier: 'rare' | 'epic' | 'exotic'): number {
  const cfg = PITY_CONFIG[tier];
  if (counter <= cfg.start) return 1.0;
  if (counter >= cfg.max)   return cfg.maxBonus;
  return 1.0 + (cfg.maxBonus - 1.0) * (counter - cfg.start) / (cfg.max - cfg.start);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns current pity multipliers for rare, epic, and exotic rarity tiers.
 * Legendary always returns 1.0 (no pity).
 * Call this inside pickWeightedSpecies before computing per-species weights.
 */
export function getPityMultipliers(): { rare: number; epic: number; exotic: number } {
  const s = load();
  return {
    rare:   multiplier(s.sinceRare,   'rare'),
    epic:   multiplier(s.sinceEpic,   'epic'),
    exotic: multiplier(s.sinceExotic, 'exotic'),
  };
}

/**
 * Call once after every discovery with the rarity of what was found.
 * Updates and persists pity counters:
 *  - Finding rare+    resets sinceRare  (and increments sinceEpic + sinceExotic)
 *  - Finding epic+    resets sinceEpic  (and increments sinceExotic)
 *  - Finding exotic+  resets sinceExotic
 */
export function recordDiscovery(rarity: Rarity): void {
  const t = TIER[rarity] ?? 1;
  const s = load();

  // Counter for each tier: increment if that tier was NOT found, reset if it was
  if (t >= TIER.rare)   { s.sinceRare   = 0; } else { s.sinceRare++;   }
  if (t >= TIER.epic)   { s.sinceEpic   = 0; } else { s.sinceEpic++;   }
  if (t >= TIER.exotic) { s.sinceExotic = 0; } else { s.sinceExotic++; }

  save(s);
}

/** Read current counters (for debug/display purposes). */
export function getPityCounters(): PityCounters {
  return load();
}
