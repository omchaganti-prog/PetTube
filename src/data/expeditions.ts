/**
 * expeditions.ts — Dynamic, intelligent expedition board generator.
 *
 * All expeditions are generated fresh from current player metrics, so:
 *  - Targets are always achievable (impossible quests are never shown)
 *  - Quests automatically scale when new species are added to the registry
 *  - Claimed quests naturally disappear when their progress condition is met
 */

import { ANIMAL_REGISTRY } from './animalRegistry';
import type { Rarity } from '../types';

// ── Public types ──────────────────────────────────────────────────────────

export type ExpeditionCategory =
  | 'discovery' | 'streak' | 'exploration' | 'collection'
  | 'rarity' | 'secret' | 'legendary';

export type ExpeditionTier = 'short' | 'medium' | 'long' | 'legendary';

export type RewardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'exotic' | 'legendary';

/**
 * RewardType — what the inventory receives when the reward is claimed.
 *   • ticket types  → add 1 to tickets[type]
 *   • boost types   → push an ActiveBoost entry
 *   • mystery_crate → random ticket or boost
 *   • theme         → unlock the AppThemeId in payload
 *   • effect        → unlock the EffectType in payload
 *   • frame         → unlock the ProfileFrameId in payload
 *   • title         → unlock the TitleId in payload
 */
export type RewardType =
  | 'rare_ticket' | 'epic_ticket' | 'exotic_ticket' | 'legendary_ticket'
  | 'rare_boost'  | 'exotic_boost' | 'insight_boost'
  | 'mystery_crate'
  | 'theme' | 'effect' | 'frame' | 'title';

export interface ExpeditionReward {
  icon: string;
  label: string;
  description: string;
  type: RewardType;
  /** Specific cosmetic/title ID for type 'theme' | 'effect' | 'frame' | 'title' */
  payload?: string;
  rarity: RewardRarity;
}

export interface ExpeditionStage {
  /** Human-readable goal sentence */
  objective: string;
  /** Shown instead of objective for hidden/secret expeditions before completion */
  hint?: string;
  progressCurrent: number;
  progressTarget: number;
}

export interface Expedition {
  id: string;
  icon: string;
  title: string;
  description?: string;
  category: ExpeditionCategory;
  tier: ExpeditionTier;
  /** Single-stage expeditions have one entry; multi-stage have 2–4 */
  stages: ExpeditionStage[];
  /** Index of the stage currently being worked on (>= stages.length = fully complete) */
  currentStageIdx: number;
  reward: ExpeditionReward;
  /** If true the objective text is masked as "???" until the expedition is complete */
  hidden?: boolean;
  /** If true the card receives special "unique" visual treatment */
  unique?: boolean;
}

/** Full metrics snapshot passed in from the React layer */
export interface ExpeditionMetrics {
  discoveredCount: number;
  totalCount: number;
  currentStreak: number;
  longestStreak: number;
  favoritesCount: number;
  discoveredByGroup: Record<string, number>;
  totalByGroup: Record<string, number>;
  discoveredByRarity: Partial<Record<Rarity, number>>;
  totalByRarity: Partial<Record<Rarity, number>>;
  claimedQuestIds: string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────

export function pct(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

function currentStageOf(stages: ExpeditionStage[]): number {
  const idx = stages.findIndex((s) => s.progressCurrent < s.progressTarget);
  return idx === -1 ? stages.length : idx;
}

function allDone(stages: ExpeditionStage[]): boolean {
  return stages.every((s) => s.progressCurrent >= s.progressTarget);
}

// ── Registry-derived constants (computed once at module load) ─────────────

const TOTAL_BY_GROUP: Record<string, number> = ANIMAL_REGISTRY.reduce<Record<string, number>>(
  (acc, e) => { acc[e.group] = (acc[e.group] ?? 0) + 1; return acc; }, {}
);

const TOTAL_BY_RARITY: Partial<Record<Rarity, number>> = ANIMAL_REGISTRY.reduce<Partial<Record<Rarity, number>>>(
  (acc, e) => { acc[e.speciesRarity] = (acc[e.speciesRarity] ?? 0) + 1; return acc; }, {}
);

const GROUP_LABEL: Record<string, string> = {
  pets: 'Pet', farm: 'Farm', ocean: 'Ocean', birds: 'Bird',
  wild: 'Wild', exotic: 'Exotic', reptiles: 'Reptile',
  amphibians: 'Amphibian', baby: 'Baby',
};

const GROUP_ICON: Record<string, string> = {
  pets: '🐾', farm: '🌾', ocean: '🌊', birds: '🦅',
  wild: '🌿', exotic: '🦁', reptiles: '🦎', amphibians: '🐸', baby: '🍼',
};

// ── Main generator ────────────────────────────────────────────────────────

export function generateExpeditions(metrics: ExpeditionMetrics): Expedition[] {
  const {
    discoveredCount, totalCount, currentStreak, longestStreak,
    favoritesCount, discoveredByGroup, discoveredByRarity, claimedQuestIds,
  } = metrics;

  const completionPct = totalCount > 0
    ? Math.round((discoveredCount / totalCount) * 100)
    : 0;

  const bestStreak = Math.max(currentStreak, longestStreak);
  const all: Expedition[] = [];

  // ── 🧭 DISCOVERY expeditions ─────────────────────────────────────────

  const discMilestones = [3, 5, 10, 20, 35, totalCount].filter(
    (t, i, arr) => t <= totalCount && t > discoveredCount && arr.indexOf(t) === i,
  );
  const discTargets = discMilestones.slice(0, 2);

  for (const target of discTargets) {
    const stages: ExpeditionStage[] = [{
      objective: `Discover ${target} species`,
      progressCurrent: discoveredCount,
      progressTarget: target,
    }];
    all.push({
      id: `exp-disc-${target}`,
      icon: '🧭',
      title: target <= 5 ? 'Field Scout'
           : target <= 10 ? 'Trailblazer'
           : target <= 20 ? 'Expedition Veteran'
           : target < totalCount ? 'Master Explorer'
           : 'Complete Explorer',
      description: `Discover ${target} unique animal species.`,
      category: 'discovery',
      tier: target <= 5 ? 'short' : target <= 15 ? 'medium' : 'long',
      stages,
      currentStageIdx: currentStageOf(stages),
      reward: target <= 5
        ? { icon: '🔵', label: 'Rare Encounter Ticket',  type: 'rare_ticket',   rarity: 'uncommon', description: 'Guarantees your next discovery is Rare or better.' }
        : target <= 10
        ? { icon: '🍀', label: 'Rare Boost',              type: 'rare_boost',    rarity: 'rare',     description: 'Increases Rare encounter chance for 20 discoveries.' }
        : target <= 20
        ? { icon: '🟣', label: 'Epic Encounter Ticket',   type: 'epic_ticket',   rarity: 'epic',     description: 'Guarantees your next discovery is Epic or better.' }
        : { icon: '🟠', label: 'Exotic Encounter Ticket', type: 'exotic_ticket', rarity: 'exotic',   description: 'Guarantees your next discovery is Exotic or better.' },
    });
  }

  // ── 🔥 STREAK expeditions ────────────────────────────────────────────

  const streakDefs: Array<{
    target: number; title: string; tier: ExpeditionTier; reward: ExpeditionReward;
  }> = [
    {
      target: 3, title: 'Committed Explorer', tier: 'short',
      reward: { icon: '🔮', label: 'Collection Insight', type: 'insight_boost', rarity: 'uncommon',
                description: 'Undiscovered species appear 50% more often for 15 discoveries.' },
    },
    {
      target: 7, title: 'Week Warrior', tier: 'medium',
      reward: { icon: '🍀', label: 'Rare Boost', type: 'rare_boost', rarity: 'rare',
                description: 'Increases Rare encounter chance for 20 discoveries.' },
    },
    {
      target: 14, title: 'Devoted Naturalist', tier: 'long',
      reward: { icon: '🟠', label: 'Exotic Encounter Ticket', type: 'exotic_ticket', rarity: 'exotic',
                description: 'Guarantees your next discovery is Exotic or better.' },
    },
    {
      target: 30, title: 'Streak Legend', tier: 'legendary',
      reward: { icon: '⚡', label: 'Lightning Reveal', type: 'effect', payload: 'lightning', rarity: 'legendary',
                description: 'Unlock the electrifying Lightning discovery effect.' },
    },
  ];

  const streakTargets = streakDefs.filter((d) => bestStreak < d.target).slice(0, 2);
  for (const def of streakTargets) {
    const stages: ExpeditionStage[] = [{
      objective: `Maintain a ${def.target}-day discovery streak`,
      progressCurrent: bestStreak,
      progressTarget: def.target,
    }];
    all.push({
      id: `exp-streak-${def.target}`,
      icon: '🔥',
      title: def.title,
      description: `Visit PetTube every day until your streak reaches ${def.target}.`,
      category: 'streak',
      tier: def.tier,
      stages,
      currentStageIdx: currentStageOf(stages),
      reward: def.reward,
    });
  }

  // ── 🌎 EXPLORATION expeditions (per group) ───────────────────────────

  const exploreGroups = ['ocean', 'birds', 'wild', 'exotic', 'reptiles', 'amphibians', 'farm', 'pets']
    .filter((g) => {
      const total = TOTAL_BY_GROUP[g] ?? 0;
      const disc  = discoveredByGroup[g] ?? 0;
      return total >= 2 && disc < total;
    })
    .sort((a, b) => {
      const remA = (TOTAL_BY_GROUP[a] ?? 0) - (discoveredByGroup[a] ?? 0);
      const remB = (TOTAL_BY_GROUP[b] ?? 0) - (discoveredByGroup[b] ?? 0);
      return remB - remA;
    })
    .slice(0, 4);

  const exploreRewards: Record<string, ExpeditionReward> = {
    ocean:      { icon: '🌊', label: 'Ocean Theme',             type: 'theme',        payload: 'ocean',   rarity: 'rare',     description: 'Unlock the calm Ocean color theme.' },
    birds:      { icon: '🔵', label: 'Rare Encounter Ticket',   type: 'rare_ticket',                      rarity: 'uncommon', description: 'Guarantees Rare or better on your next discovery.' },
    wild:       { icon: '🌿', label: 'Jungle Theme',            type: 'theme',        payload: 'jungle',  rarity: 'rare',     description: 'Unlock the lush Jungle color theme.' },
    exotic:     { icon: '🟠', label: 'Exotic Encounter Ticket', type: 'exotic_ticket',                    rarity: 'exotic',   description: 'Guarantees Exotic or better on your next discovery.' },
    reptiles:   { icon: '🔥', label: 'Fire Reveal',             type: 'effect',       payload: 'fire',    rarity: 'rare',     description: 'Unlock the fiery Fire discovery effect.' },
    amphibians: { icon: '🌊', label: 'Water Reveal',            type: 'effect',       payload: 'water',   rarity: 'rare',     description: 'Unlock the flowing Water discovery effect.' },
    farm:       { icon: '🍀', label: 'Rare Boost',              type: 'rare_boost',                       rarity: 'uncommon', description: 'Increases Rare encounter chance for 20 discoveries.' },
    pets:       { icon: '✨', label: 'Sparkle Reveal',          type: 'effect',       payload: 'sparkle', rarity: 'uncommon', description: 'Unlock the dazzling Sparkle discovery effect.' },
  };

  for (const group of exploreGroups) {
    const total    = TOTAL_BY_GROUP[group] ?? 0;
    const disc     = discoveredByGroup[group] ?? 0;
    const halfGoal = Math.max(2, Math.ceil(total * 0.5));
    const target   = Math.min(halfGoal, total);
    if (disc >= target) continue;

    const stages: ExpeditionStage[] = [{
      objective: `Discover ${target} ${GROUP_LABEL[group] ?? group} species`,
      progressCurrent: disc,
      progressTarget: target,
    }];
    all.push({
      id: `exp-explore-${group}`,
      icon: GROUP_ICON[group] ?? '🌿',
      title: `${GROUP_LABEL[group] ?? group} Explorer`,
      description: `Uncover the wonders of the ${GROUP_LABEL[group] ?? group} kingdom.`,
      category: 'exploration',
      tier: total <= 4 ? 'short' : total <= 7 ? 'medium' : 'long',
      stages,
      currentStageIdx: currentStageOf(stages),
      reward: exploreRewards[group] ?? {
        icon: '🔵', label: 'Rare Encounter Ticket', type: 'rare_ticket', rarity: 'uncommon',
        description: 'Guarantees Rare or better on your next discovery.',
      },
    });
  }

  // ── 📖 COLLECTION expeditions (percentage milestones) ───────────────

  const collMilestones: Array<{
    pct: number; title: string; tier: ExpeditionTier; reward: ExpeditionReward; unique?: boolean;
  }> = [
    {
      pct: 10, title: 'First Folio', tier: 'short',
      reward: { icon: '🔮', label: 'Collection Insight', type: 'insight_boost', rarity: 'uncommon',
                description: 'Undiscovered species appear 50% more often for 15 discoveries.' },
    },
    {
      pct: 25, title: 'Promising Collector', tier: 'medium',
      reward: { icon: '🌿', label: 'Jungle Theme', type: 'theme', payload: 'jungle', rarity: 'rare',
                description: 'Unlock the lush Jungle color theme.' },
    },
    {
      pct: 50, title: 'Halfway Explorer', tier: 'long',
      reward: { icon: '🌌', label: 'Galaxy Theme', type: 'theme', payload: 'galaxy', rarity: 'epic',
                description: 'Unlock the cosmic Galaxy color theme.' },
    },
    {
      pct: 75, title: 'Elite Collector', tier: 'long', unique: true,
      reward: { icon: '💎', label: 'Crystal Frame', type: 'frame', payload: 'crystal', rarity: 'epic',
                description: 'Unlock the prestigious Crystal profile frame.' },
    },
    {
      pct: 100, title: 'Perfect Collection', tier: 'legendary', unique: true,
      reward: { icon: '👑', label: 'Legendary Frame', type: 'frame', payload: 'legendary_frame', rarity: 'legendary',
                description: 'Unlock the Legendary Frame — the ultimate prestige reward.' },
    },
  ];

  const collTargets = collMilestones
    .filter((m) => completionPct < m.pct)
    .slice(0, 3);

  for (const m of collTargets) {
    const stages: ExpeditionStage[] = [{
      objective: `Reach ${m.pct}% collection completion`,
      progressCurrent: completionPct,
      progressTarget: m.pct,
    }];
    all.push({
      id: `exp-coll-${m.pct}`,
      icon: '📖',
      title: m.title,
      description: `Fill your collection archive to ${m.pct}% capacity.`,
      category: 'collection',
      tier: m.tier,
      stages,
      currentStageIdx: currentStageOf(stages),
      reward: m.reward,
      unique: m.unique,
    });
  }

  // ── ⭐ RARITY expeditions ────────────────────────────────────────────

  const rarityDefs: Array<{
    rarity: Rarity; title: string; tier: ExpeditionTier; reward: ExpeditionReward;
  }> = [
    {
      rarity: 'rare', title: 'First Rare', tier: 'short',
      reward: { icon: '🍀', label: 'Rare Boost', type: 'rare_boost', rarity: 'rare',
                description: 'Increases Rare encounter chance for 20 discoveries.' },
    },
    {
      rarity: 'epic', title: 'Epic Discovery', tier: 'medium',
      reward: { icon: '✨', label: 'Sparkle Reveal', type: 'effect', payload: 'sparkle', rarity: 'rare',
                description: 'Unlock the dazzling Sparkle discovery effect.' },
    },
    {
      rarity: 'exotic', title: 'Exotic Encounter', tier: 'long',
      reward: { icon: '🌈', label: 'Rainbow Reveal', type: 'effect', payload: 'rainbow', rarity: 'exotic',
                description: 'Unlock the vivid Rainbow discovery effect.' },
    },
    {
      rarity: 'legendary', title: 'Legendary Sighting', tier: 'legendary',
      reward: { icon: '🟡', label: 'Legendary Zoologist', type: 'title', payload: 'legendary_zoologist', rarity: 'legendary',
                description: 'Earn the "Legendary Zoologist" title — the highest honour.' },
    },
  ];

  for (const def of rarityDefs) {
    const disc  = discoveredByRarity[def.rarity] ?? 0;
    const total = TOTAL_BY_RARITY[def.rarity] ?? 0;
    if (total === 0 || disc > 0) continue;

    const label = def.rarity.charAt(0).toUpperCase() + def.rarity.slice(1);
    const icon  = def.rarity === 'legendary' ? '🟡'
                : def.rarity === 'exotic'    ? '🟠'
                : def.rarity === 'epic'      ? '🟣' : '🔵';

    const stages: ExpeditionStage[] = [{
      objective: `Discover your first ${label} species`,
      progressCurrent: disc,
      progressTarget: 1,
    }];
    all.push({
      id: `exp-rarity-first-${def.rarity}`,
      icon,
      title: def.title,
      description: `Find a ${label}-rarity species for the first time.`,
      category: 'rarity',
      tier: def.tier,
      stages,
      currentStageIdx: currentStageOf(stages),
      reward: def.reward,
    });
  }

  // Discover ALL legendaries (if some found but not all)
  const legendaryDisc  = discoveredByRarity['legendary'] ?? 0;
  const legendaryTotal = TOTAL_BY_RARITY['legendary'] ?? 0;
  if (legendaryDisc > 0 && legendaryDisc < legendaryTotal) {
    const stages: ExpeditionStage[] = [{
      objective: `Discover all ${legendaryTotal} Legendary species`,
      progressCurrent: legendaryDisc,
      progressTarget: legendaryTotal,
    }];
    all.push({
      id: 'exp-legendary-all',
      icon: '👑',
      title: 'The Legendary Few',
      description: 'Hunt down every Legendary species in existence.',
      category: 'legendary',
      tier: 'legendary',
      stages,
      currentStageIdx: currentStageOf(stages),
      reward: {
        icon: '🎆', label: 'Fireworks Reveal', type: 'effect', payload: 'fireworks', rarity: 'legendary',
        description: 'Unlock the spectacular Fireworks discovery effect.',
      },
      unique: true,
    });
  }

  // ── ❓ SECRET expeditions ─────────────────────────────────────────────

  if (favoritesCount < 5) {
    const stages: ExpeditionStage[] = [{
      objective: 'Save 5 discoveries to Favorites',
      hint: 'Something precious waits to be collected…',
      progressCurrent: favoritesCount,
      progressTarget: 5,
    }];
    all.push({
      id: 'exp-secret-favorites',
      icon: '❓',
      title: 'Field Notes',
      category: 'secret',
      tier: 'short',
      stages,
      currentStageIdx: currentStageOf(stages),
      reward: {
        icon: '🎁', label: 'Mystery Crate', type: 'mystery_crate', rarity: 'rare',
        description: 'A sealed crate containing a random surprise reward.',
      },
      hidden: true,
    });
  }

  const exoticDisc  = discoveredByRarity['exotic'] ?? 0;
  const exoticTotal = TOTAL_BY_RARITY['exotic'] ?? 0;
  if (exoticTotal >= 3 && exoticDisc < 3) {
    const stages: ExpeditionStage[] = [{
      objective: 'Discover 3 Exotic species',
      hint: 'Something extraordinarily rare lurks out there…',
      progressCurrent: exoticDisc,
      progressTarget: 3,
    }];
    all.push({
      id: 'exp-secret-exotic-3',
      icon: '❓',
      title: 'The Hidden Wild',
      category: 'secret',
      tier: 'long',
      stages,
      currentStageIdx: currentStageOf(stages),
      reward: {
        icon: '🌸', label: 'Sakura Theme', type: 'theme', payload: 'sakura', rarity: 'exotic',
        description: 'Unlock the vivid Sakura blossom color theme.',
      },
      hidden: true,
      unique: true,
    });
  }

  // ── 🌎 MULTI-STAGE expeditions ────────────────────────────────────────

  if (totalCount >= 20) {
    const worldStages: ExpeditionStage[] = [
      { objective: 'Discover 5 species',            progressCurrent: discoveredCount, progressTarget: 5  },
      { objective: 'Discover 15 species',           progressCurrent: discoveredCount, progressTarget: 15 },
      { objective: 'Reach 25% collection progress', progressCurrent: completionPct,  progressTarget: 25 },
    ];
    if (!allDone(worldStages)) {
      all.push({
        id: 'exp-world-explorer',
        icon: '🌎',
        title: 'World Explorer',
        description: 'A legendary three-stage journey across the animal kingdom.',
        category: 'discovery',
        tier: 'medium',
        stages: worldStages,
        currentStageIdx: currentStageOf(worldStages),
        reward: {
          icon: '🌊', label: 'Ocean Theme', type: 'theme', payload: 'ocean', rarity: 'epic',
          description: 'Unlock the calm Ocean theme — awarded to true World Explorers.',
        },
        unique: true,
      });
    }
  }

  if (totalCount >= 30) {
    const grandStages: ExpeditionStage[] = [
      { objective: 'Discover 10 species',           progressCurrent: discoveredCount,           progressTarget: 10 },
      { objective: 'Discover 25 species',           progressCurrent: discoveredCount,           progressTarget: 25 },
      { objective: 'Discover your first Exotic',    progressCurrent: Math.min(exoticDisc, 1),  progressTarget: 1  },
      { objective: 'Reach 50% collection progress', progressCurrent: completionPct,             progressTarget: 50 },
    ];
    if (!allDone(grandStages)) {
      all.push({
        id: 'exp-grand',
        icon: '🏔️',
        title: 'The Grand Expedition',
        description: 'The ultimate four-stage adventure for dedicated explorers.',
        category: 'legendary',
        tier: 'legendary',
        stages: grandStages,
        currentStageIdx: currentStageOf(grandStages),
        reward: {
          icon: '🌌', label: 'Galaxy Theme', type: 'theme', payload: 'galaxy', rarity: 'legendary',
          description: 'Unlock the cosmic Galaxy theme — the mark of a Grand Explorer.',
        },
        unique: true,
      });
    }
  }

  // ── Filter claimed quests & sort ──────────────────────────────────────

  const tierOrder: Record<ExpeditionTier, number> = { short: 0, medium: 1, long: 2, legendary: 3 };

  return all
    .filter((e) => !claimedQuestIds.includes(e.id))
    .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
}
