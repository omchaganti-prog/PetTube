import type { AnimalImage, AnimalCategory, Rarity } from '../types';
import { CATEGORIES, RARITY_WEIGHTS } from '../constants';
import { ANIMAL_REGISTRY, REGISTRY_BY_ID, REGISTRY_BY_GROUP, getAnimalFact, ALL_ANIMAL_IDS } from '../data/animalRegistry';
import { getImageUrl } from '../services/imagePool';
import { getPityMultipliers, recordDiscovery } from './pitySystem';
import { getActiveTicketMinRarity, consumeActiveTicket, getBoostMultipliers, getDiscoveredSpeciesIds, tickDiscovery } from './rewardSystem';
import { recordSpeciesShown, getSpeciesDiversityMultiplier } from './imageHistory';

// Numeric tier order for ticket minimum-rarity comparisons
const TIER_ORDER: Record<Rarity, number> = {
  common: 1, uncommon: 2, rare: 3, epic: 4, exotic: 5, legendary: 6,
};

let imageCounter = 0;

// Running total of discoveries made this session, used for image cooldown scoring
let sessionDiscoveryCount = 0;

export function getSessionDiscoveryCount(): number {
  return sessionDiscoveryCount;
}

function getAnimalEmoji(id: string): string {
  return REGISTRY_BY_ID.get(id)?.emoji ?? '🐾';
}

function getAnimalName(id: string): string {
  return REGISTRY_BY_ID.get(id)?.name ?? formatCategory(id);
}

function getAnimalTags(id: string): string[] {
  return REGISTRY_BY_ID.get(id)?.tags ?? [];
}

/**
 * Pick a species using tier-normalised, pity-adjusted, and boost-adjusted weights.
 *
 * Tier normalisation: each species' weight = RARITY_WEIGHTS[tier] / tierCount
 * This ensures the probability of each TIER matches the target rates in
 * RARITY_WEIGHTS regardless of how many species exist in each tier.
 *
 * Pity adjustment: multiply rare/epic/exotic weights by their pity bonus.
 * Boost adjustment: multiply rare/exotic by active boost multipliers.
 * Ticket: filter to only species meeting the minimum rarity.
 * Insight: undiscovered species get a +50% weight bonus.
 */
function pickWeightedSpecies(): AnimalCategory {
  const ticketMinRarity = getActiveTicketMinRarity();
  const minTier = ticketMinRarity ? TIER_ORDER[ticketMinRarity] : 0;
  const pity   = getPityMultipliers();
  const boosts = getBoostMultipliers();
  const discovered = boosts.insightActive ? getDiscoveredSpeciesIds() : null;

  // Count how many species exist per rarity tier (for normalization)
  const tierCounts: Partial<Record<Rarity, number>> = {};
  for (const entry of ANIMAL_REGISTRY) {
    tierCounts[entry.speciesRarity] = (tierCounts[entry.speciesRarity] ?? 0) + 1;
  }

  // When a ticket is active, only consider species that meet the minimum tier
  const candidates = minTier > 0
    ? ANIMAL_REGISTRY.filter((e) => TIER_ORDER[e.speciesRarity] >= minTier)
    : ANIMAL_REGISTRY;

  const weighted = candidates.map((entry) => {
    const tier  = entry.speciesRarity;
    const count = tierCounts[tier] || 1;
    // Base: tier target ÷ species count in tier → tier probability stays on target
    let weight = RARITY_WEIGHTS[tier] / count;
    // Pity multipliers (legendary excluded by design)
    if (tier === 'rare')   weight *= pity.rare;
    if (tier === 'epic')   weight *= pity.epic;
    if (tier === 'exotic') weight *= pity.exotic;
    // Boost multipliers
    if (tier === 'rare')   weight *= boosts.rare;
    if (tier === 'exotic') weight *= boosts.exotic;
    // Insight boost: undiscovered species are more likely
    if (discovered && !discovered.has(entry.id)) weight *= 1.5;
    // Diversity cooldown: penalise species shown recently
    weight *= getSpeciesDiversityMultiplier(entry.id);
    return { id: entry.id as AnimalCategory, weight };
  });

  const total = weighted.reduce((sum, { weight }) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const { id, weight } of weighted) {
    roll -= weight;
    if (roll <= 0) return id;
  }
  return weighted[weighted.length - 1].id;
}

/** Generate one fully-formed discovery animal. */
export function generateSingleAnimal(
  fixedCategory?: AnimalCategory,
): AnimalImage {
  const category = fixedCategory ?? pickWeightedSpecies();
  // Consume any pending ticket — it was already applied inside pickWeightedSpecies
  if (!fixedCategory) consumeActiveTicket();
  const entry = REGISTRY_BY_ID.get(category);
  const rarity: Rarity = entry?.speciesRarity ?? 'common';
  // Update pity counters and decrement active boosts
  recordDiscovery(rarity);
  tickDiscovery();
  // Record species shown for diversity cooldown, bump discovery counter for image scoring
  recordSpeciesShown(category);
  sessionDiscoveryCount += 1;
  return {
    id: `disc-${category}-${++imageCounter}-${Date.now()}`,
    url: getImageUrl(category, sessionDiscoveryCount),
    category,
    title: `${getAnimalEmoji(category)} ${getAnimalName(category)}`,
    fact: getAnimalFact(category),
    rarity,
    tags: getAnimalTags(category),
    discoveredAt: Date.now(),
  };
}

/** Generate one animal from a specific registry group (e.g. 'ocean'). */
export function generateFromGroup(group: string): AnimalImage {
  const entries = REGISTRY_BY_GROUP[group] ?? [];
  if (entries.length === 0) return generateSingleAnimal();
  const entry = entries[Math.floor(Math.random() * entries.length)];
  return generateSingleAnimal(entry.id as AnimalCategory);
}

function makeImage(category: AnimalCategory, prefix: string): AnimalImage {
  const entry = REGISTRY_BY_ID.get(category);
  const rarity: Rarity = entry?.speciesRarity ?? 'common';
  return {
    id: `${prefix}-${category}-${++imageCounter}-${Date.now()}`,
    url: getImageUrl(category),
    category,
    title: `${getAnimalEmoji(category)} ${getAnimalName(category)}`,
    fact: getAnimalFact(category),
    rarity,
    tags: getAnimalTags(category),
    discoveredAt: Date.now(),
  };
}

export function generateImagesForCategory(
  category: AnimalCategory,
  count = 8,
  _offset = 0,
): AnimalImage[] {
  return Array.from({ length: count }, () => makeImage(category, 'cat'));
}

export function generateMixedImages(count = 12, offset = 0): AnimalImage[] {
  return Array.from({ length: count }, (_, i) => {
    const category = CATEGORIES[(offset + i) % CATEGORIES.length];
    return makeImage(category, 'mix');
  });
}

export function generateSurpriseImages(count = 12): AnimalImage[] {
  const shuffled = [...CATEGORIES].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, i) => {
    const category = shuffled[i % shuffled.length];
    return makeImage(category, 'sur');
  });
}

export function getDailyAnimal(): AnimalCategory {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return ALL_ANIMAL_IDS[dayOfYear % ALL_ANIMAL_IDS.length] as AnimalCategory;
}

export function formatCategory(cat: string): string {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function downloadImage(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function shareImage(url: string, title: string): void {
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).catch(() => {});
  }
}
