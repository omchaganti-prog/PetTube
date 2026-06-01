/**
 * rewardSystem.ts — Non-React localStorage-backed module for reward state.
 *
 * Designed to be imported by imageUtils.ts (which runs outside React) so that
 * ticket and boost effects can be applied inside pickWeightedSpecies().
 *
 * Pattern mirrors pitySystem.ts — reads/writes localStorage directly.
 */

import type { RewardInventory, Rarity } from '../types';
import { LS_INVENTORY_KEY, LS_COLLECTION_KEY } from '../constants';

// ── Defaults ──────────────────────────────────────────────────────────────

const DEFAULT_INVENTORY: RewardInventory = {
  tickets: {},
  activeBoosts: [],
  unlockedThemes: ['default'],
  activeTheme: 'default',
  unlockedEffects: ['none'],
  activeEffect: 'none',
  earnedTitles: [],
  activeTitle: null,
  unlockedFrames: ['none'],
  activeFrame: 'none',
  pendingTicketMinRarity: null,
  claimedQuestIds: [],
};

// ── Load / save ──────────────────────────────────────────────────────────

export function getInventory(): RewardInventory {
  try {
    const raw = localStorage.getItem(LS_INVENTORY_KEY);
    if (!raw) return { ...DEFAULT_INVENTORY };
    const parsed = JSON.parse(raw) as Partial<RewardInventory>;
    return {
      ...DEFAULT_INVENTORY,
      ...parsed,
      tickets:        parsed.tickets        ?? {},
      activeBoosts:   parsed.activeBoosts   ?? [],
      unlockedThemes: parsed.unlockedThemes ?? ['default'],
      unlockedEffects: parsed.unlockedEffects ?? ['none'],
      earnedTitles:   parsed.earnedTitles   ?? [],
      unlockedFrames: parsed.unlockedFrames ?? ['none'],
      activeFrame:    parsed.activeFrame    ?? 'none',
      claimedQuestIds: parsed.claimedQuestIds ?? [],
    };
  } catch {
    return { ...DEFAULT_INVENTORY };
  }
}

export function saveInventory(inv: RewardInventory): void {
  try {
    localStorage.setItem(LS_INVENTORY_KEY, JSON.stringify(inv));
  } catch { /* storage quota — silently ignore */ }
}

// ── Ticket helpers (called by imageUtils.ts) ──────────────────────────────

/** Returns the minimum rarity the next discovery must meet, or null. */
export function getActiveTicketMinRarity(): Rarity | null {
  return getInventory().pendingTicketMinRarity;
}

/**
 * Clear the pending ticket after it has been used.
 * Safe to call even when no ticket is active (no-op).
 */
export function consumeActiveTicket(): void {
  const inv = getInventory();
  if (inv.pendingTicketMinRarity === null) return;
  inv.pendingTicketMinRarity = null;
  saveInventory(inv);
}

// ── Boost helpers (called by imageUtils.ts) ───────────────────────────────

/** Returns multipliers for the rare and exotic tiers, and whether insight is active. */
export function getBoostMultipliers(): { rare: number; exotic: number; insightActive: boolean } {
  const boosts = getInventory().activeBoosts.filter((b) => b.remainingUses > 0);
  let rare  = 1.0;
  let exotic = 1.0;
  let insightActive = false;
  for (const b of boosts) {
    if (b.type === 'rare_boost')    rare   *= 1.5;
    if (b.type === 'exotic_boost')  exotic *= 2.0;
    if (b.type === 'insight_boost') insightActive = true;
  }
  return { rare, exotic, insightActive };
}

/** Read all discovered species IDs from the collection store. */
export function getDiscoveredSpeciesIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_COLLECTION_KEY);
    if (!raw) return new Set();
    return new Set(Object.keys(JSON.parse(raw) as Record<string, unknown>));
  } catch {
    return new Set();
  }
}

/**
 * Decrement all active boosts by 1 discovery.  Expired boosts are removed.
 * Call this once per generateSingleAnimal() invocation.
 */
export function tickDiscovery(): void {
  const inv = getInventory();
  inv.activeBoosts = inv.activeBoosts
    .map((b) => ({ ...b, remainingUses: b.remainingUses - 1 }))
    .filter((b) => b.remainingUses > 0);
  saveInventory(inv);
}
