/**
 * rewardDefinitions.ts — Static catalogue of every reward in the game.
 *
 * Provides human-readable names, icons, and descriptions for all:
 * tickets, boosts, themes, effects, frames, and titles.
 */

import type { TicketType, BoostType, AppThemeId, EffectType, TitleId, ProfileFrameId } from '../types';

// ── Tickets ───────────────────────────────────────────────────────────────

export interface TicketDef {
  id: TicketType;
  icon: string;
  name: string;
  description: string;
  minRarityLabel: string;
}

export const TICKET_DEFS: TicketDef[] = [
  {
    id: 'rare_ticket',
    icon: '🔵',
    name: 'Rare Encounter Ticket',
    description: 'Your next discovery is guaranteed to be Rare or better.',
    minRarityLabel: 'Rare+',
  },
  {
    id: 'epic_ticket',
    icon: '🟣',
    name: 'Epic Encounter Ticket',
    description: 'Your next discovery is guaranteed to be Epic or better.',
    minRarityLabel: 'Epic+',
  },
  {
    id: 'exotic_ticket',
    icon: '🟠',
    name: 'Exotic Encounter Ticket',
    description: 'Your next discovery is guaranteed to be Exotic or better.',
    minRarityLabel: 'Exotic+',
  },
  {
    id: 'legendary_ticket',
    icon: '🟡',
    name: 'Legendary Encounter Ticket',
    description: 'Your next discovery is guaranteed to be a Legendary species.',
    minRarityLabel: 'Legendary',
  },
];

// ── Boosts ────────────────────────────────────────────────────────────────

export interface BoostDef {
  id: BoostType;
  icon: string;
  name: string;
  description: string;
  durationLabel: string;
  defaultUses: number;
}

export const BOOST_DEFS: BoostDef[] = [
  {
    id: 'rare_boost',
    icon: '🍀',
    name: 'Rare Boost',
    description: '+50% Rare encounter chance.',
    durationLabel: '20 discoveries',
    defaultUses: 20,
  },
  {
    id: 'exotic_boost',
    icon: '🍀',
    name: 'Exotic Boost',
    description: '+100% Exotic encounter chance.',
    durationLabel: '10 discoveries',
    defaultUses: 10,
  },
  {
    id: 'insight_boost',
    icon: '🔮',
    name: 'Collection Insight',
    description: 'Undiscovered species are 50% more likely to appear.',
    durationLabel: '15 discoveries',
    defaultUses: 15,
  },
];

export const BOOST_DEF_MAP = new Map(BOOST_DEFS.map((b) => [b.id, b]));

// ── Themes ────────────────────────────────────────────────────────────────

export interface ThemeDef {
  id: AppThemeId;
  icon: string;
  name: string;
  description: string;
  cssClass: string;
}

export const THEME_DEFS: ThemeDef[] = [
  { id: 'default',   icon: '🌸', name: 'Default',   description: 'The original PetTube pink-purple palette.', cssClass: '' },
  { id: 'galaxy',    icon: '🌌', name: 'Galaxy',    description: 'Deep cosmic purples and indigo accents.',   cssClass: 'theme-galaxy' },
  { id: 'jungle',    icon: '🌿', name: 'Jungle',    description: 'Lush greens and earthy teal tones.',        cssClass: 'theme-jungle' },
  { id: 'ocean',     icon: '🌊', name: 'Ocean',     description: 'Calm blues and bright cyan highlights.',    cssClass: 'theme-ocean' },
  { id: 'sakura',    icon: '🌸', name: 'Sakura',    description: 'Vivid rose and hot-pink blossom colours.',  cssClass: 'theme-sakura' },
  { id: 'winter',    icon: '❄️', name: 'Winter',    description: 'Icy blues and crisp crystalline accents.',  cssClass: 'theme-winter' },
  { id: 'night_sky', icon: '🌙', name: 'Night Sky', description: 'Deep indigo with shimmering star accents.', cssClass: 'theme-night-sky' },
  { id: 'tropical',  icon: '🏝️', name: 'Tropical',  description: 'Warm amber and vivid palm-green tones.',   cssClass: 'theme-tropical' },
  { id: 'mountain',  icon: '🏔️', name: 'Mountain',  description: 'Cool slate grays with misty blue peaks.',  cssClass: 'theme-mountain' },
  { id: 'volcano',   icon: '🔥', name: 'Volcano',   description: 'Deep reds and molten orange embers.',       cssClass: 'theme-volcano' },
  { id: 'cloud',     icon: '☁️', name: 'Cloud',     description: 'Soft whites and silvery sky tones.',        cssClass: 'theme-cloud' },
];

export const THEME_DEF_MAP = new Map(THEME_DEFS.map((t) => [t.id, t]));

// ── Effects ────────────────────────────────────────────────────────────────

export interface EffectDef {
  id: EffectType;
  icon: string;
  name: string;
  description: string;
  cssClass: string;
}

export const EFFECT_DEFS: EffectDef[] = [
  { id: 'none',      icon: '⚪', name: 'No Effect',        description: 'Standard reveal with no special animation.',          cssClass: '' },
  { id: 'sparkle',   icon: '✨', name: 'Sparkle Reveal',   description: 'Glittering sparkles burst when your animal appears.',  cssClass: 'effect-sparkle' },
  { id: 'fire',      icon: '🔥', name: 'Fire Reveal',      description: 'Flames erupt from the bottom of the reveal.',          cssClass: 'effect-fire' },
  { id: 'water',     icon: '🌊', name: 'Water Reveal',     description: 'A rippling wave sweeps across the card.',              cssClass: 'effect-water' },
  { id: 'rainbow',   icon: '🌈', name: 'Rainbow Reveal',   description: 'A full rainbow sweep frames the discovery.',           cssClass: 'effect-rainbow' },
  { id: 'lightning', icon: '⚡', name: 'Lightning Reveal', description: 'A bolt of lightning electrifies the reveal.',          cssClass: 'effect-lightning' },
  { id: 'fireworks', icon: '🎆', name: 'Fireworks Reveal', description: 'Spectacular fireworks burst across the screen.',       cssClass: 'effect-fireworks' },
  { id: 'confetti',  icon: '🎉', name: 'Confetti Blast',   description: 'A joyful explosion of colorful confetti.',             cssClass: 'effect-confetti' },
  { id: 'snow',      icon: '❄️', name: 'Snow Reveal',      description: 'Gentle snowflakes drift down as the animal appears.',  cssClass: 'effect-snow' },
];

export const EFFECT_DEF_MAP = new Map(EFFECT_DEFS.map((e) => [e.id, e]));

// ── Titles ────────────────────────────────────────────────────────────────

export interface TitleDef {
  id: TitleId;
  icon: string;
  label: string;
  description: string;
  autoUnlock?: string;   // human-readable condition for auto-unlock
}

export const TITLE_DEFS: TitleDef[] = [
  {
    id: 'animal_explorer',
    icon: '🌿',
    label: 'Animal Explorer',
    description: 'Given to every PetTube adventurer.',
    autoUnlock: 'Available to all players.',
  },
  {
    id: 'rare_hunter',
    icon: '🔵',
    label: 'Rare Hunter',
    description: 'Awarded for discovering your first Rare species.',
    autoUnlock: 'Discover any Rare species.',
  },
  {
    id: 'exotic_expert',
    icon: '🟠',
    label: 'Exotic Expert',
    description: 'Awarded for discovering your first Exotic species.',
    autoUnlock: 'Discover any Exotic species.',
  },
  {
    id: 'master_collector',
    icon: '👑',
    label: 'Master Collector',
    description: 'Earned by completing 75% of the collection.',
    autoUnlock: 'Reach 75% collection completion.',
  },
  {
    id: 'legendary_zoologist',
    icon: '🟡',
    label: 'Legendary Zoologist',
    description: 'Reserved for those who discover a Legendary species.',
    autoUnlock: 'Discover any Legendary species.',
  },
  {
    id: 'streak_master',
    icon: '🔥',
    label: 'Streak Master',
    description: 'Awarded for maintaining a 30-day discovery streak.',
    autoUnlock: 'Complete the Streak Legend expedition.',
  },
  {
    id: 'world_explorer',
    icon: '🌎',
    label: 'World Explorer',
    description: 'Awarded for completing the World Explorer expedition.',
    autoUnlock: 'Complete the World Explorer expedition.',
  },
  {
    id: 'secret_keeper',
    icon: '❓',
    label: 'Secret Keeper',
    description: 'Awarded for completing all secret expeditions.',
    autoUnlock: 'Complete all secret expeditions.',
  },
];

export const TITLE_DEF_MAP = new Map(TITLE_DEFS.map((t) => [t.id, t]));

// ── Frames ─────────────────────────────────────────────────────────────────

export interface FrameDef {
  id: ProfileFrameId;
  icon: string;
  name: string;
  description: string;
  cssClass: string;
}

export const FRAME_DEFS: FrameDef[] = [
  { id: 'none',            icon: '⬜', name: 'No Frame',        description: 'Clean profile with no frame.',                    cssClass: '' },
  { id: 'wooden',          icon: '🪵', name: 'Wooden Frame',    description: 'A warm, rustic wooden border.',                   cssClass: 'frame-wooden' },
  { id: 'silver',          icon: '🪙', name: 'Silver Frame',    description: 'A polished silver metallic border.',              cssClass: 'frame-silver' },
  { id: 'gold',            icon: '🥇', name: 'Gold Frame',      description: 'A gleaming gold border with a warm glow.',        cssClass: 'frame-gold' },
  { id: 'crystal',         icon: '💎', name: 'Crystal Frame',   description: 'A prismatic crystal border that shifts colors.',   cssClass: 'frame-crystal' },
  { id: 'galaxy_frame',    icon: '🌌', name: 'Galaxy Frame',    description: 'A cosmic border with nebula swirls.',             cssClass: 'frame-galaxy' },
  { id: 'legendary_frame', icon: '👑', name: 'Legendary Frame', description: 'The ultimate frame reserved for true legends.',   cssClass: 'frame-legendary' },
];

export const FRAME_DEF_MAP = new Map(FRAME_DEFS.map((f) => [f.id, f]));

// ── Re-export RewardType for convenience ──────────────────────────────────

export type { RewardType } from './expeditions';
