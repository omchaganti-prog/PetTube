import { useState, useCallback, useMemo, useRef } from 'react';
import { LS_COLLECTION_KEY, LS_MILESTONES_KEY, COLLECTION_MILESTONES } from '../constants';
import { ALL_ANIMAL_IDS, REGISTRY_BY_ID } from '../data/animalRegistry';
import type { Rarity, SpeciesEntry, CollectionStore } from '../types';
import confetti from 'canvas-confetti';

// ── Persistence helpers ────────────────────────────────────────────────────

function loadCollection(): CollectionStore {
  try {
    const raw = localStorage.getItem(LS_COLLECTION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const result: CollectionStore = {};
      for (const [id, val] of Object.entries(parsed)) {
        if (!ALL_ANIMAL_IDS.includes(id)) continue; // drop stale keys
        if (typeof val === 'number') {
          // Migrate old format (timestamp-only)
          result[id] = { discoveredAt: val, encounterCount: 1, favoriteCount: 0 };
        } else if (val && typeof val === 'object' && 'discoveredAt' in val) {
          const v = val as Partial<SpeciesEntry>;
          result[id] = {
            discoveredAt:   v.discoveredAt   ?? Date.now(),
            encounterCount: v.encounterCount ?? 1,
            favoriteCount:  v.favoriteCount  ?? 0,
            firstImageUrl:  v.firstImageUrl,
          };
        }
      }
      return result;
    }
  } catch { /* ignore */ }
  return {};
}

function saveCollection(col: CollectionStore): void {
  try { localStorage.setItem(LS_COLLECTION_KEY, JSON.stringify(col)); } catch { /* ignore */ }
}

function loadMilestones(): Set<number> {
  try {
    const raw = localStorage.getItem(LS_MILESTONES_KEY);
    if (raw) return new Set(JSON.parse(raw) as number[]);
  } catch { /* ignore */ }
  return new Set();
}

function saveMilestones(m: Set<number>): void {
  try { localStorage.setItem(LS_MILESTONES_KEY, JSON.stringify([...m])); } catch { /* ignore */ }
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useCollection() {
  const [collection, setCollection] = useState<CollectionStore>(loadCollection);
  // Ref mirrors state so callbacks always read the latest value synchronously
  const collRef = useRef(collection);
  collRef.current = collection;

  // Milestones don't drive UI, so keep in a plain ref (mutated in place)
  const [milestones] = useState<Set<number>>(loadMilestones);

  const total = ALL_ANIMAL_IDS.length;

  /**
   * Mark a species as encountered.
   * Returns true if this is the FIRST discovery (triggers popup / celebration).
   * Returns false if species was already discovered (encounter count incremented).
   */
  const markDiscovered = useCallback((animalId: string, imageUrl?: string): boolean => {
    if (!ALL_ANIMAL_IDS.includes(animalId)) return false;

    const existing = collRef.current[animalId];

    if (existing) {
      // Already discovered — just bump encounter count
      const updated: CollectionStore = {
        ...collRef.current,
        [animalId]: { ...existing, encounterCount: existing.encounterCount + 1 },
      };
      collRef.current = updated;
      saveCollection(updated);
      setCollection(updated);
      return false;
    }

    // First discovery!
    const updated: CollectionStore = {
      ...collRef.current,
      [animalId]: {
        discoveredAt:   Date.now(),
        encounterCount: 1,
        favoriteCount:  0,
        firstImageUrl:  imageUrl,
      },
    };
    collRef.current = updated;
    saveCollection(updated);
    setCollection(updated);

    // Fire confetti at milestone thresholds
    const count = Object.keys(updated).length;
    const pct = Math.round((count / total) * 100);
    for (const ms of COLLECTION_MILESTONES) {
      if (pct >= ms && !milestones.has(ms)) {
        milestones.add(ms);
        saveMilestones(milestones);
        confetti({
          particleCount: ms === 100 ? 300 : 130,
          spread: 90,
          origin: { y: 0.45 },
          colors: ['#eab308', '#f97316', '#9c27b0', '#2196f3', '#4caf50'],
        });
        break; // fire once per call
      }
    }

    return true;
  }, [total, milestones]);

  /** Increment the favorite count for a species (called when user favorites an image). */
  const incrementFavorite = useCallback((animalId: string) => {
    const existing = collRef.current[animalId];
    if (!existing) return;
    const updated: CollectionStore = {
      ...collRef.current,
      [animalId]: { ...existing, favoriteCount: existing.favoriteCount + 1 },
    };
    collRef.current = updated;
    saveCollection(updated);
    setCollection(updated);
  }, []);

  /** Decrement the favorite count for a species (called when user un-favorites). */
  const decrementFavorite = useCallback((animalId: string) => {
    const existing = collRef.current[animalId];
    if (!existing) return;
    const updated: CollectionStore = {
      ...collRef.current,
      [animalId]: {
        ...existing,
        favoriteCount: Math.max(0, existing.favoriteCount - 1),
      },
    };
    collRef.current = updated;
    saveCollection(updated);
    setCollection(updated);
  }, []);

  const isDiscovered = useCallback(
    (animalId: string) => Boolean(collRef.current[animalId]),
    [],
  );

  const discoveredCount = useMemo(() => Object.keys(collection).length, [collection]);

  const getByRarity = useCallback(
    (rarity: Rarity): string[] =>
      ALL_ANIMAL_IDS.filter((id) => REGISTRY_BY_ID.get(id)?.speciesRarity === rarity),
    [],
  );

  const discoveredByRarity = useCallback(
    (rarity: Rarity): number =>
      getByRarity(rarity).filter((id) => Boolean(collection[id])).length,
    [collection, getByRarity],
  );

  return {
    collection,
    markDiscovered,
    incrementFavorite,
    decrementFavorite,
    isDiscovered,
    discoveredCount,
    totalCount: total,
    getByRarity,
    discoveredByRarity,
  };
}
