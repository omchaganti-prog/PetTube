/** Dynamic: any string from animalRegistry.ts — adding new animals requires no type changes. */
export type AnimalCategory = string;

export type AnimalGroup =
  | 'pets' | 'farm' | 'ocean' | 'birds' | 'wild'
  | 'exotic' | 'reptiles' | 'amphibians' | 'baby';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'exotic' | 'legendary';

/** Per-species persistence record stored in localStorage */
export interface SpeciesEntry {
  discoveredAt:   number;    // timestamp (ms) when first discovered
  encounterCount: number;    // total times this species was seen
  favoriteCount:  number;    // times the user favorited this species
  firstImageUrl?: string;    // URL of the image shown on first discovery
}

/** The full collection store: species id → SpeciesEntry */
export type CollectionStore = Record<string, SpeciesEntry>;

export interface AnimalImage {
  id: string;
  url: string;
  category: AnimalCategory;
  title: string;
  fact: string;
  rarity: Rarity;
  tags?: string[];     // from registry
  discoveredAt?: number;
}

export interface FavoriteItem extends AnimalImage {
  savedAt: number;
}

export type Theme = 'light' | 'dark';

export type FilterCategory = AnimalCategory | 'all';

// ── Reward system ─────────────────────────────────────────────────────────

export type TicketType =
  | 'rare_ticket' | 'epic_ticket' | 'exotic_ticket' | 'legendary_ticket';

export type BoostType  = 'rare_boost' | 'exotic_boost' | 'insight_boost';

export type AppThemeId =
  | 'default' | 'galaxy' | 'jungle' | 'ocean' | 'sakura'
  | 'winter' | 'night_sky' | 'tropical' | 'mountain' | 'volcano' | 'cloud';

export type EffectType =
  | 'none' | 'sparkle' | 'fire' | 'water' | 'rainbow'
  | 'lightning' | 'fireworks' | 'confetti' | 'snow';

export type TitleId =
  | 'animal_explorer'
  | 'rare_hunter'
  | 'exotic_expert'
  | 'master_collector'
  | 'legendary_zoologist'
  | 'streak_master'
  | 'world_explorer'
  | 'secret_keeper';

export type ProfileFrameId =
  | 'none' | 'wooden' | 'silver' | 'gold' | 'crystal' | 'galaxy_frame' | 'legendary_frame';

export interface ActiveBoost {
  type: BoostType;
  remainingUses: number;
  totalUses: number;
}

export interface RewardInventory {
  tickets: Partial<Record<TicketType, number>>;
  activeBoosts: ActiveBoost[];
  unlockedThemes: AppThemeId[];
  activeTheme: AppThemeId;
  unlockedEffects: EffectType[];
  activeEffect: EffectType;
  earnedTitles: TitleId[];
  activeTitle: TitleId | null;
  unlockedFrames: ProfileFrameId[];
  activeFrame: ProfileFrameId;
  /** Set by useTicket(); consumed inside generateSingleAnimal() */
  pendingTicketMinRarity: Rarity | null;
  claimedQuestIds: string[];
}
