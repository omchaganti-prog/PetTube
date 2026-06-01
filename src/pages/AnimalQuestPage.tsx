import React, { useMemo, useState } from 'react';
import { useCollectionCtx, useFavCtx, useInventoryCtx } from '../context/AppContext';
import { REGISTRY_BY_ID } from '../data/animalRegistry';
import { generateExpeditions, pct } from '../data/expeditions';
import type { Expedition, ExpeditionCategory, ExpeditionTier } from '../data/expeditions';
import { getCurrentStreak, getLongestStreak } from '../utils/progression';
import { syncBoard } from '../utils/expeditionBoard';

// ── Category filter tabs ──────────────────────────────────────────────────

const CATEGORIES: Array<{ id: ExpeditionCategory | 'all'; label: string }> = [
  { id: 'all',         label: '🗺️ All' },
  { id: 'discovery',   label: '🧭 Discovery' },
  { id: 'streak',      label: '🔥 Streak' },
  { id: 'exploration', label: '🌎 Exploration' },
  { id: 'collection',  label: '📖 Collection' },
  { id: 'rarity',      label: '⭐ Rarity' },
  { id: 'secret',      label: '❓ Secret' },
  { id: 'legendary',   label: '👑 Legendary' },
];

const TIER_LABEL: Record<ExpeditionTier, string> = {
  short:     'Short-term',
  medium:    'Medium-term',
  long:      'Long-term',
  legendary: 'Legendary',
};

const RARITY_COLOR: Record<string, string> = {
  common:    'var(--text-muted)',
  uncommon:  '#4ade80',
  rare:      '#60a5fa',
  epic:      '#c084fc',
  exotic:    '#fb923c',
  legendary: '#facc15',
};

// ── Reward claim modal ────────────────────────────────────────────────────

interface RewardModalProps {
  expedition: Expedition;
  onClaim: () => void;
  onClose: () => void;
}

function RewardModal({ expedition, onClaim, onClose }: RewardModalProps) {
  const { reward } = expedition;
  const rarityColor = RARITY_COLOR[reward.rarity] ?? 'var(--accent)';
  return (
    <div className="reward-modal-overlay" role="dialog" aria-modal="true" aria-label="Expedition Complete">
      <div className="reward-modal">
        <div className="reward-modal-header">
          <span className="reward-modal-trophy">🏆</span>
          <h2>Expedition Complete!</h2>
          <p className="reward-modal-quest-name">{expedition.icon} {expedition.title}</p>
        </div>

        <div className="reward-modal-divider" />

        <div className="reward-modal-reward">
          <p className="reward-modal-label">Reward Earned</p>
          <div className="reward-modal-item">
            <span className="reward-modal-icon">{reward.icon}</span>
            <div>
              <strong style={{ color: rarityColor }}>{reward.label}</strong>
              <p className="reward-modal-rarity-tag" style={{ color: rarityColor }}>
                {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)} Reward
              </p>
              <p>{reward.description}</p>
            </div>
          </div>
        </div>

        <button className="reward-modal-collect-btn" onClick={onClaim}>
          Collect Reward
        </button>
        <button className="reward-modal-skip" onClick={onClose}>
          Collect Later
        </button>
      </div>
      <button className="reward-modal-backdrop" aria-label="Close" onClick={onClose} />
    </div>
  );
}

// ── Expedition card ────────────────────────────────────────────────────────

interface ExpeditionCardProps {
  expedition: Expedition;
  claimed: boolean;
  onCollect: (expedition: Expedition) => void;
}

function ExpeditionCard({ expedition, claimed, onCollect }: ExpeditionCardProps) {
  const stage = expedition.stages[expedition.currentStageIdx] ?? expedition.stages[expedition.stages.length - 1];
  const isComplete = expedition.currentStageIdx >= expedition.stages.length;
  const isMultiStage = expedition.stages.length > 1;
  const { reward } = expedition;
  const rarityColor = RARITY_COLOR[reward.rarity] ?? 'var(--accent)';

  return (
    <article
      role="listitem"
      className={[
        'expedition-card',
        expedition.unique   ? 'expedition-card-unique' : '',
        isComplete          ? 'expedition-card--complete' : '',
        claimed             ? 'expedition-card--claimed' : '',
        `expedition-card--${expedition.tier}`,
      ].filter(Boolean).join(' ')}
    >
      <div className="expedition-topline">
        <span className="expedition-icon">{expedition.icon}</span>
        <div className="expedition-title-group">
          <h2>{expedition.title}</h2>
          <span className="expedition-tier-pill">{TIER_LABEL[expedition.tier]}</span>
        </div>
        {isComplete && claimed && <span className="expedition-claimed-badge">✅ Claimed</span>}
      </div>

      {expedition.description && (
        <p className="expedition-description">{expedition.description}</p>
      )}

      {/* Multi-stage progress list */}
      {isMultiStage && (
        <ol className="expedition-stage-list">
          {expedition.stages.map((s, i) => {
            const done   = i < expedition.currentStageIdx;
            const active = i === expedition.currentStageIdx;
            const locked = i > expedition.currentStageIdx;
            const cls    = done ? 'expedition-stage--done' : active ? 'expedition-stage--active' : 'expedition-stage--locked';
            const objective = expedition.hidden && !done && !active ? '???' : (s.hint && locked ? s.hint : s.objective);
            return (
              <li key={i} className={`expedition-stage ${cls}`}>
                <span className="expedition-stage-marker">{done ? '✅' : active ? '🔄' : '🔒'}</span>
                <span className="expedition-stage-obj">{objective}</span>
                {active && (
                  <span className="expedition-stage-count">
                    {Math.min(s.progressCurrent, s.progressTarget)}/{s.progressTarget}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {/* Single-stage objective */}
      {!isMultiStage && (
        <div className="expedition-row">
          <span>Objective</span>
          <p>{expedition.hidden && !isComplete ? (stage.hint ?? '???') : stage.objective}</p>
        </div>
      )}

      {/* Reward badge */}
      <div className="expedition-reward-badge" style={{ borderColor: rarityColor }}>
        <span>{reward.icon}</span>
        <div>
          <strong style={{ color: rarityColor }}>{reward.label}</strong>
          <small style={{ color: rarityColor, opacity: 0.85 }}>
            {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
          </small>
        </div>
      </div>

      {/* Progress bar for current active stage */}
      {!isComplete && (
        <div className="expedition-row">
          <span>Progress</span>
          <p>{Math.min(stage.progressCurrent, stage.progressTarget)}/{stage.progressTarget}</p>
          <div className="expedition-progress-track" aria-hidden="true">
            <div
              className="expedition-progress-fill"
              style={{ width: `${pct(stage.progressCurrent, stage.progressTarget)}%` }}
            />
          </div>
        </div>
      )}

      {expedition.hidden && !isComplete && (
        <p className="expedition-hidden-note">Objective revealed upon completion.</p>
      )}

      {isComplete && !claimed && (
        <button className="expedition-collect-btn" onClick={() => onCollect(expedition)}>
          ⭐ Collect Reward!
        </button>
      )}
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function AnimalQuestPage() {
  const { collection, discoveredCount, totalCount } = useCollectionCtx();
  const { count: favoritesCount } = useFavCtx();
  const { inventory, claimReward } = useInventoryCtx();
  const [pendingClaim, setPendingClaim]     = useState<Expedition | null>(null);
  const [activeCategory, setActiveCategory] = useState<ExpeditionCategory | 'all'>('all');

  const discoveredTimestamps = Object.fromEntries(
    Object.entries(collection).map(([id, e]) => [id, e.discoveredAt]),
  );

  const currentStreak = getCurrentStreak(discoveredTimestamps);
  const longestStreak = getLongestStreak(discoveredTimestamps);

  const discoveredByGroup: Record<string, number> = {};
  const totalByGroup: Record<string, number> = {};
  const discoveredByRarity: Record<string, number> = {};

  for (const [id, entry] of Object.entries(collection)) {
    void entry;
    const animal = REGISTRY_BY_ID.get(id);
    if (!animal) continue;
    discoveredByGroup[animal.group] = (discoveredByGroup[animal.group] ?? 0) + 1;
    discoveredByRarity[animal.speciesRarity] = (discoveredByRarity[animal.speciesRarity] ?? 0) + 1;
  }

  const board = useMemo(() => {
    const pool = generateExpeditions({
      discoveredCount,
      totalCount,
      currentStreak,
      longestStreak,
      favoritesCount,
      discoveredByGroup,
      totalByGroup,
      discoveredByRarity,
      totalByRarity: {},
      claimedQuestIds: inventory.claimedQuestIds,
    });
    return syncBoard(pool, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoveredCount, totalCount, currentStreak, longestStreak, favoritesCount,
     JSON.stringify(discoveredByGroup), JSON.stringify(discoveredByRarity),
     inventory.claimedQuestIds.length]);

  const filtered = activeCategory === 'all'
    ? board
    : board.filter((e) => e.category === activeCategory);

  function handleCollect() {
    if (!pendingClaim) return;
    claimReward(pendingClaim.id, pendingClaim.reward);
    setPendingClaim(null);
  }

  // Count active (unclaimed complete) per category
  const completeCounts: Partial<Record<ExpeditionCategory | 'all', number>> = {};
  for (const e of board) {
    if (e.currentStageIdx >= e.stages.length && !inventory.claimedQuestIds.includes(e.id)) {
      completeCounts['all'] = (completeCounts['all'] ?? 0) + 1;
      completeCounts[e.category] = (completeCounts[e.category] ?? 0) + 1;
    }
  }

  return (
    <div className="quest-page expedition-page">
      <div className="quest-header expedition-header">
        <h1>🧭 Expeditions</h1>
        <p className="quest-subtitle">
          You have <strong>{board.length}</strong> active expeditions. Finish one and a new challenge unlocks automatically.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="exp-cat-tabs" role="tablist" aria-label="Expedition categories">
        {CATEGORIES.map((cat) => {
          const count = completeCounts[cat.id];
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`exp-cat-tab${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
              {count ? <span className="exp-cat-badge">{count}</span> : null}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="expedition-empty">
          {activeCategory === 'all'
            ? '🎉 You\'ve completed all available expeditions for now!'
            : `No active ${activeCategory} expeditions right now.`}
        </p>
      ) : (
        <div className="expedition-grid" role="list" aria-label="Expedition Quests">
          {filtered.map((expedition) => (
            <ExpeditionCard
              key={expedition.id}
              expedition={expedition}
              claimed={inventory.claimedQuestIds.includes(expedition.id)}
              onCollect={(e) => setPendingClaim(e)}
            />
          ))}
        </div>
      )}

      {pendingClaim && (
        <RewardModal
          expedition={pendingClaim}
          onClaim={handleCollect}
          onClose={() => setPendingClaim(null)}
        />
      )}
    </div>
  );
}
