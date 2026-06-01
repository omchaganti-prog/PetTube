/**
 * useInventory.ts — React hook for managing the reward inventory.
 *
 * Provides all the actions players need to earn, use, and equip rewards.
 * State is persisted to localStorage via rewardSystem.ts.
 */

import { useState, useCallback, useEffect } from 'react';
import type { RewardInventory, TicketType, AppThemeId, EffectType, TitleId, ProfileFrameId, Rarity, TitleId as TId } from '../types';
import { getInventory, saveInventory } from '../utils/rewardSystem';
import { REGISTRY_BY_ID } from '../data/animalRegistry';
import { LS_COLLECTION_KEY } from '../constants';
import type { RewardType } from '../data/expeditions';

// ── Ticket → minimum rarity mapping ──────────────────────────────────────

const TICKET_MIN_RARITY: Record<TicketType, Rarity> = {
  rare_ticket:      'rare',
  epic_ticket:      'epic',
  exotic_ticket:    'exotic',
  legendary_ticket: 'legendary',
};

// ── Pure mutation helper (no side-effects — returns new inventory) ────────

const MYSTERY_CRATE_POOL: TicketType[] = ['rare_ticket', 'rare_ticket', 'epic_ticket', 'exotic_ticket'];

function applyReward(
  inv: RewardInventory,
  rewardType: RewardType,
  payload?: string,
): RewardInventory {
  const next = {
    ...inv,
    tickets:         { ...inv.tickets },
    activeBoosts:    [...inv.activeBoosts],
    unlockedThemes:  [...inv.unlockedThemes],
    unlockedEffects: [...inv.unlockedEffects],
    unlockedFrames:  [...(inv.unlockedFrames ?? ['none' as ProfileFrameId])],
    earnedTitles:    [...inv.earnedTitles],
  };

  switch (rewardType) {
    case 'rare_ticket':
      next.tickets.rare_ticket = (next.tickets.rare_ticket ?? 0) + 1;
      break;
    case 'epic_ticket':
      next.tickets.epic_ticket = (next.tickets.epic_ticket ?? 0) + 1;
      break;
    case 'exotic_ticket':
      next.tickets.exotic_ticket = (next.tickets.exotic_ticket ?? 0) + 1;
      break;
    case 'legendary_ticket':
      next.tickets.legendary_ticket = (next.tickets.legendary_ticket ?? 0) + 1;
      break;
    case 'rare_boost':
      next.activeBoosts.push({ type: 'rare_boost', remainingUses: 20, totalUses: 20 });
      break;
    case 'exotic_boost':
      next.activeBoosts.push({ type: 'exotic_boost', remainingUses: 10, totalUses: 10 });
      break;
    case 'insight_boost':
      next.activeBoosts.push({ type: 'insight_boost', remainingUses: 15, totalUses: 15 });
      break;
    case 'mystery_crate': {
      // Random selection from the pool (weighted toward rare_ticket)
      const pick = MYSTERY_CRATE_POOL[Math.floor(Math.random() * MYSTERY_CRATE_POOL.length)];
      next.tickets[pick] = (next.tickets[pick] ?? 0) + 1;
      break;
    }
    case 'theme': {
      const themeId = payload as AppThemeId | undefined;
      if (themeId && !next.unlockedThemes.includes(themeId)) {
        next.unlockedThemes.push(themeId);
      }
      break;
    }
    case 'effect': {
      const effectId = payload as EffectType | undefined;
      if (effectId && !next.unlockedEffects.includes(effectId)) {
        next.unlockedEffects.push(effectId);
      }
      break;
    }
    case 'frame': {
      const frameId = payload as ProfileFrameId | undefined;
      if (frameId && !next.unlockedFrames.includes(frameId)) {
        next.unlockedFrames.push(frameId);
      }
      break;
    }
    case 'title': {
      const titleId = payload as TitleId | undefined;
      if (titleId && !(next.earnedTitles as string[]).includes(titleId)) {
        next.earnedTitles.push(titleId as TId);
      }
      break;
    }
    default:
      break;
  }

  return next;
}

// ── Auto-unlock titles from collection state ──────────────────────────────

function autoUnlockTitles(inv: RewardInventory): RewardInventory {
  try {
    const raw = localStorage.getItem(LS_COLLECTION_KEY);
    const collection = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const rarities = new Set(
      Object.keys(collection).map((id) => REGISTRY_BY_ID.get(id)?.speciesRarity),
    );

    const titles = new Set(inv.earnedTitles);

    // Everyone gets Animal Explorer
    titles.add('animal_explorer');
    // Earned by finding that rarity tier
    if (rarities.has('rare'))      titles.add('rare_hunter');
    if (rarities.has('epic'))      titles.add('rare_hunter');   // epic implies rare hunter too
    if (rarities.has('exotic'))    titles.add('exotic_expert');
    if (rarities.has('legendary')) titles.add('legendary_zoologist');

    const newTitles = [...titles] as TitleId[];
    if (newTitles.length === inv.earnedTitles.length) return inv;  // nothing changed
    return { ...inv, earnedTitles: newTitles };
  } catch {
    return inv;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useInventory() {
  const [inventory, setInventory] = useState<RewardInventory>(() => {
    const inv = getInventory();
    // Ensure 'animal_explorer' + 'none' defaults are always present
    const withDefaults = {
      ...inv,
      earnedTitles: inv.earnedTitles.includes('animal_explorer')
        ? inv.earnedTitles
        : (['animal_explorer', ...inv.earnedTitles] as TitleId[]),
      unlockedEffects: inv.unlockedEffects.includes('none')
        ? inv.unlockedEffects
        : (['none', ...inv.unlockedEffects] as EffectType[]),
    };
    return autoUnlockTitles(withDefaults);
  });

  // Apply saved color theme to DOM on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', inventory.activeTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper: update state + persist
  const commit = useCallback((next: RewardInventory) => {
    saveInventory(next);
    setInventory(next);
  }, []);

  // ── Refresh auto-unlocked titles when collection changes ──
  const refreshTitles = useCallback(() => {
    setInventory((prev) => {
      const next = autoUnlockTitles(prev);
      if (next === prev) return prev;
      saveInventory(next);
      return next;
    });
  }, []);

  // ── Claim a quest reward ───────────────────────────────────────────────

  const claimReward = useCallback(
    (questId: string, reward: { type: RewardType; payload?: string }) => {
      setInventory((prev) => {
        if (prev.claimedQuestIds.includes(questId)) return prev;  // already claimed
        const withReward = applyReward(prev, reward.type, reward.payload);
        const next: RewardInventory = {
          ...withReward,
          claimedQuestIds: [...withReward.claimedQuestIds, questId],
        };
        saveInventory(next);
        return next;
      });
    },
    [],
  );

  // ── Use a ticket (sets pendingTicketMinRarity) ─────────────────────────

  const useTicket = useCallback((type: TicketType) => {
    setInventory((prev) => {
      const count = prev.tickets[type] ?? 0;
      if (count <= 0) return prev;
      const next: RewardInventory = {
        ...prev,
        tickets: { ...prev.tickets, [type]: count - 1 },
        pendingTicketMinRarity: TICKET_MIN_RARITY[type],
      };
      saveInventory(next);
      return next;
    });
  }, []);

  /** Cancel the currently pending ticket without using it. */
  const cancelTicket = useCallback(() => {
    setInventory((prev) => {
      if (!prev.pendingTicketMinRarity) return prev;
      const next: RewardInventory = { ...prev, pendingTicketMinRarity: null };
      saveInventory(next);
      return next;
    });
  }, []);

  // ── Themes ────────────────────────────────────────────────────────────

  const activateTheme = useCallback((themeId: AppThemeId) => {
    setInventory((prev) => {
      if (!prev.unlockedThemes.includes(themeId)) return prev;
      const next: RewardInventory = { ...prev, activeTheme: themeId };
      saveInventory(next);
      document.documentElement.setAttribute('data-color-theme', themeId);
      return next;
    });
  }, []);

  // ── Effects ───────────────────────────────────────────────────────────

  const activateEffect = useCallback((effectId: EffectType) => {
    setInventory((prev) => {
      if (!prev.unlockedEffects.includes(effectId)) return prev;
      const next: RewardInventory = { ...prev, activeEffect: effectId };
      saveInventory(next);
      return next;
    });
  }, []);

  // ── Frames ────────────────────────────────────────────────────────────

  const activateFrame = useCallback((frameId: ProfileFrameId) => {
    setInventory((prev) => {
      const frames = prev.unlockedFrames ?? ['none' as ProfileFrameId];
      if (!frames.includes(frameId)) return prev;
      const next: RewardInventory = { ...prev, activeFrame: frameId };
      saveInventory(next);
      return next;
    });
  }, []);

  // ── Titles ────────────────────────────────────────────────────────────

  const equipTitle = useCallback((titleId: TitleId) => {
    setInventory((prev) => {
      if (!prev.earnedTitles.includes(titleId)) return prev;
      const next: RewardInventory = { ...prev, activeTitle: titleId };
      saveInventory(next);
      return next;
    });
  }, []);

  const unequipTitle = useCallback(() => {
    setInventory((prev) => {
      const next: RewardInventory = { ...prev, activeTitle: null };
      saveInventory(next);
      return next;
    });
  }, []);

  return {
    inventory,
    claimReward,
    useTicket,
    cancelTicket,
    activateTheme,
    activateEffect,
    activateFrame,
    equipTitle,
    unequipTitle,
    refreshTitles,
  };
}
