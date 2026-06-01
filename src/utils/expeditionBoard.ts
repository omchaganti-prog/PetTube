/**
 * expeditionBoard.ts — Persistent rotating quest board.
 *
 * Shows exactly BOARD_SIZE quests at a time.
 * When a quest is claimed (and disappears from the pool), a random
 * replacement is automatically picked so the board always stays full.
 * The board is stored in localStorage so it survives page refreshes.
 */

import type { Expedition } from '../data/expeditions';

const BOARD_KEY   = 'pettube-expedition-board';
const BOARD_SIZE  = 5;

// ── localStorage helpers ──────────────────────────────────────────────────

function loadBoardIds(): string[] {
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function saveBoardIds(ids: string[]): void {
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(ids));
  } catch { /* storage quota – silently ignore */ }
}

// ── Fisher-Yates shuffle ──────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Syncs the persisted active board with the current quest pool.
 *
 * Algorithm:
 *  1. Load the saved board IDs from localStorage.
 *  2. Keep only the IDs that are still present in the pool
 *     (claimed quests are already stripped from the pool by generateExpeditions).
 *  3. Randomly pick quests from the remainder of the pool to fill empty slots.
 *  4. Save the new board and return the Expedition objects.
 *
 * This means:
 *  - Board is stable across page reloads (same quests until one is claimed).
 *  - Every time a quest is claimed a new random one replaces it immediately.
 *  - Two players with the same progress see different quests (randomised fills).
 */
export function syncBoard(pool: Expedition[], size = BOARD_SIZE): Expedition[] {
  const poolMap = new Map(pool.map(e => [e.id, e]));
  const saved   = loadBoardIds();

  // Keep board quests that still exist in the pool
  const activeIds = saved.filter(id => poolMap.has(id));

  // Randomly pick replacements for empty slots
  const remaining = shuffle(pool.filter(e => !activeIds.includes(e.id)));
  const toAdd     = remaining.slice(0, Math.max(0, size - activeIds.length));

  const newIds = [...activeIds, ...toAdd.map(e => e.id)];
  saveBoardIds(newIds);

  return newIds
    .map(id => poolMap.get(id))
    .filter((e): e is Expedition => e != null);
}

/** Wipe the saved board (useful for testing / hard reset). */
export function clearBoard(): void {
  localStorage.removeItem(BOARD_KEY);
}
