import { ANIMAL_REGISTRY } from '../data/animalRegistry';
import type { Rarity } from '../types';

// ── Derived from registry (auto-updates when animals are added) ──────────
export const CATEGORIES = ANIMAL_REGISTRY.map((e) => e.id);

export const CATEGORY_EMOJIS: Record<string, string> = Object.fromEntries(
  ANIMAL_REGISTRY.map((e) => [e.id, e.emoji]),
);

export const FILTER_LABELS: Record<string, string> = {
  all: 'All Animals',
  ...Object.fromEntries(ANIMAL_REGISTRY.map((e) => [e.id, `${e.name} ${e.emoji}`])),
};

/** All facts aggregated from every registry entry */
export const ANIMAL_FACTS: string[] = ANIMAL_REGISTRY.flatMap((e) => e.facts);

/** Daily rotation — spread across all registry animals */
export const DAILY_ANIMALS = CATEGORIES;

// ── Persistence keys ─────────────────────────────────────────────────────
export const LS_FAVORITES_KEY  = 'pettube-favorites';
export const LS_THEME_KEY      = 'pettube-theme';
export const LS_COLLECTION_KEY = 'pettube-collection';
export const LS_MILESTONES_KEY = 'pettube-milestones';

// ── Collection milestones (%) ─────────────────────────────────────────────
export const COLLECTION_MILESTONES = [10, 25, 50, 75, 90, 100] as const;

// ── App behaviour ─────────────────────────────────────────────────────────
export const CONFETTI_MILESTONE = 10;
export const PAGE_SIZE          = 12;

// ── Rarity system ─────────────────────────────────────────────────────────
//
// These values define the TARGET PROBABILITY (× 10) for each tier.
// e.g. common: 700 → 70% of all discoveries, legendary: 2 → 0.2%.
//
// The picker divides each species' weight by the count of species in that tier
// so that tier probabilities stay accurate regardless of how many species exist.
//
// Adjust here to re-tune the feel. Total should sum to 1000.
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common:    700,   // ~70% — very frequent
  uncommon:  200,   // ~20% — common
  rare:       70,   //  ~7% — exciting
  epic:       20,   //  ~2% — unusual
  exotic:      8,   // ~0.8% — special
  legendary:   2,   // ~0.2% — major event
};

// ── Pity system ──────────────────────────────────────────────────────────
//
// After `start` dry discoveries (no rare/epic/exotic found), the weight for
// that tier is boosted linearly up to `maxBonus`× at `max` discoveries.
// Legendary is intentionally excluded — it must remain extraordinary.
export const PITY_CONFIG: Record<'rare' | 'epic' | 'exotic', { start: number; max: number; maxBonus: number }> = {
  rare:   { start: 30,  max:  60, maxBonus: 2.0 }, // ~7%  → up to ~13%
  epic:   { start: 80,  max: 160, maxBonus: 2.5 }, // ~2%  → up to ~5%
  exotic: { start: 200, max: 400, maxBonus: 2.5 }, // ~0.8%→ up to ~1.8%
};

export const LS_PITY_KEY      = 'pettube-pity';
export const LS_INVENTORY_KEY = 'pettube-inventory';

export const RARITY_LABELS: Record<Rarity, string> = {
  common:    'Common',
  uncommon:  'Uncommon',
  rare:      'Rare',
  epic:      'Epic',
  exotic:    'Exotic',
  legendary: 'Legendary',
};

export const RARITY_COLORS: Record<Rarity, string> = {
  common:    '#9e9e9e',
  uncommon:  '#4caf50',
  rare:      '#2196f3',
  epic:      '#9c27b0',
  exotic:    '#f97316',
  legendary: '#eab308',
};

export const RARITY_ICONS: Record<Rarity, string> = {
  common:    '⚪',
  uncommon:  '🟢',
  rare:      '🔵',
  epic:      '🟣',
  exotic:    '🟠',
  legendary: '🟡',
};

/** Ordered from most to least common for display purposes */
export const RARITY_ORDER: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'exotic', 'legendary'];

export const TOTAL_ANIMALS = ANIMAL_REGISTRY.length;
