import React from 'react';
import { useCollectionCtx, useFavCtx, useInventoryCtx } from '../context/AppContext';
import { ANIMAL_REGISTRY, REGISTRY_BY_ID } from '../data/animalRegistry';
import {
  RARITY_COLORS, RARITY_ICONS, RARITY_LABELS, RARITY_ORDER,
} from '../constants';
import {
  getAchievementsUnlocked,
  getCurrentStreak,
  getDiscoveryXP,
  getLevelInfo,
  getLongestStreak,
} from '../utils/progression';
import { TITLE_DEF_MAP } from '../data/rewardDefinitions';
import { useAuth } from '../context/AuthContext';
import type { Rarity } from '../types';

// ── Static definitions ────────────────────────────────────────────────────

const ACHIEVEMENT_DEFS: Array<{ goal: number; icon: string; name: string }> = [
  { goal:   5, icon: '🔍', name: 'First Scout'       },
  { goal:  15, icon: '🌿', name: 'Trailblazer'       },
  { goal:  35, icon: '🌍', name: 'Explorer'           },
  { goal:  60, icon: '📖', name: 'Collector'          },
  { goal: 100, icon: '🏆', name: 'Expert Naturalist' },
  { goal: 150, icon: '🌟', name: 'Master Biologist'  },
  { goal: 200, icon: '👑', name: 'Legend'             },
];

const STREAK_REWARDS = [
  { days:  3, icon: '🔮', label: 'Collection Insight' },
  { days:  7, icon: '🍀', label: 'Rare Boost'          },
  { days: 14, icon: '🟠', label: 'Exotic Ticket'       },
  { days: 30, icon: '⚡', label: 'Lightning Effect'    },
];

const COLLECTION_MILESTONES = [
  { pct: 10, icon: '🔮', reward: 'Collection Insight' },
  { pct: 25, icon: '🌿', reward: 'Jungle Theme'        },
  { pct: 50, icon: '🌌', reward: 'Galaxy Theme'        },
  { pct: 75, icon: '💎', reward: 'Crystal Frame'       },
  { pct:100, icon: '👑', reward: 'Legendary Frame'     },
];

// ── Small helpers ─────────────────────────────────────────────────────────

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="prog-mini-bar-track">
      <div className="prog-mini-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="prog-section-title">{children}</h2>;
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const { collection, discoveredCount, totalCount } = useCollectionCtx();
  const { count: favCount } = useFavCtx();
  const { inventory } = useInventoryCtx();
  const { user, isGuest } = useAuth();

  // ── Derived ──────────────────────────────────────────────────────────────

  const discoveredTimestamps = Object.fromEntries(
    Object.entries(collection).map(([id, e]) => [id, e.discoveredAt]),
  );

  const completionPct  = totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0;
  const currentStreak  = getCurrentStreak(discoveredTimestamps);
  const longestStreak  = getLongestStreak(discoveredTimestamps);
  const xp             = getDiscoveryXP(discoveredCount, currentStreak);
  const levelInfo      = getLevelInfo(xp);
  const unlockedCount  = getAchievementsUnlocked(discoveredCount);

  const activeTitle    = inventory.activeTitle ? TITLE_DEF_MAP.get(inventory.activeTitle) : null;
  const totalTickets   = Object.values(inventory.tickets).reduce((s, v) => s + (v ?? 0), 0);
  const totalBoosts    = inventory.activeBoosts.filter(b => b.remainingUses > 0).length;
  const unlockedThemes = inventory.unlockedThemes.length - 1;
  const unlockedEffects= inventory.unlockedEffects.length - 1;
  const expeditionsDone= inventory.claimedQuestIds.length;

  // Rarity counts
  const rarityDiscovered: Partial<Record<Rarity, number>> = {};
  const rarityTotal:      Partial<Record<Rarity, number>> = {};
  for (const entry of ANIMAL_REGISTRY) {
    rarityTotal[entry.speciesRarity] = (rarityTotal[entry.speciesRarity] ?? 0) + 1;
  }
  for (const [id] of Object.entries(collection)) {
    const a = REGISTRY_BY_ID.get(id);
    if (a) rarityDiscovered[a.speciesRarity] = (rarityDiscovered[a.speciesRarity] ?? 0) + 1;
  }

  // Recent discoveries (sorted newest first)
  const recentDiscoveries = Object.entries(collection)
    .sort(([, a], [, b]) => b.discoveredAt - a.discoveredAt)
    .slice(0, 6)
    .map(([id, entry]) => ({ id, entry, animal: REGISTRY_BY_ID.get(id) }))
    .filter(d => d.animal);

  // Most favorited species
  const topFav = Object.entries(collection)
    .filter(([, e]) => e.favoriteCount > 0)
    .sort(([, a], [, b]) => b.favoriteCount - a.favoriteCount)[0];
  const topFavAnimal = topFav ? REGISTRY_BY_ID.get(topFav[0]) : null;

  // Next streak reward
  const nextStreakReward = STREAK_REWARDS.find(r => r.days > Math.max(currentStreak, longestStreak));

  // Next collection milestone
  const nextMilestone = COLLECTION_MILESTONES.find(m => completionPct < m.pct);

  // Profile name
  const profileName = isGuest ? 'Guest Explorer' : (user?.displayName || user?.email || 'Explorer');

  return (
    <div className="prog-page">

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="prog-hero">
        <div className="prog-hero-avatar">
          {isGuest ? '🐾' : '👤'}
        </div>
        <div className="prog-hero-info">
          <div className="prog-hero-name">
            {profileName}
            {activeTitle && (
              <span className="prog-hero-title-badge">
                {activeTitle.icon} {activeTitle.label}
              </span>
            )}
          </div>
          <div className="prog-hero-level">
            <span className="prog-level-chip">Lv. {levelInfo.level}</span>
            <span className="prog-hero-xp">{xp} XP</span>
          </div>
          {/* XP bar */}
          <div className="prog-xp-bar-wrap">
            <div className="prog-xp-bar-track">
              <div
                className="prog-xp-bar-fill"
                style={{ width: `${levelInfo.progressPct}%` }}
              />
            </div>
            <span className="prog-xp-bar-label">
              {levelInfo.xpInLevel} / {levelInfo.xpNeededForNextLevel} XP to Lv. {levelInfo.level + 1}
            </span>
          </div>
          <div className="prog-hero-completion">
            📖 {discoveredCount} / {totalCount} Species &nbsp;·&nbsp; {completionPct}% Complete
          </div>
        </div>
      </section>

      <div className="prog-grid">

        {/* ══ COLLECTION PROGRESS ══════════════════════════════════════ */}
        <section className="prog-card prog-card--wide">
          <SectionTitle>📖 Collection Progress</SectionTitle>
          <div className="prog-big-bar-wrap">
            <div className="prog-big-bar-track">
              <div className="prog-big-bar-fill" style={{ width: `${completionPct}%` }} />
              <span className="prog-big-bar-text">{completionPct}%</span>
            </div>
            <div className="prog-big-bar-meta">
              <span>{discoveredCount} discovered</span>
              <span>{totalCount - discoveredCount} remaining</span>
            </div>
          </div>

          {/* Rarity breakdown */}
          <div className="prog-rarity-list">
            {RARITY_ORDER.map((r) => {
              const disc  = rarityDiscovered[r] ?? 0;
              const total = rarityTotal[r] ?? 0;
              return (
                <div key={r} className="prog-rarity-row">
                  <span className="prog-rarity-icon">{RARITY_ICONS[r]}</span>
                  <span className="prog-rarity-name" style={{ color: RARITY_COLORS[r] }}>
                    {RARITY_LABELS[r]}
                  </span>
                  <MiniBar value={disc} max={total} color={RARITY_COLORS[r]} />
                  <span className="prog-rarity-count">{disc}/{total}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ STREAK ═════════════════════════════════════════════════ */}
        <section className="prog-card">
          <SectionTitle>🔥 Discovery Streak</SectionTitle>
          <div className="prog-streak-row">
            <div className="prog-streak-stat">
              <span className="prog-streak-num">{currentStreak}</span>
              <span className="prog-streak-label">Current</span>
            </div>
            <div className="prog-streak-divider" />
            <div className="prog-streak-stat">
              <span className="prog-streak-num">{longestStreak}</span>
              <span className="prog-streak-label">Longest</span>
            </div>
          </div>
          {nextStreakReward && (
            <div className="prog-next-reward-pill">
              <span>{nextStreakReward.icon}</span>
              <div>
                <div className="prog-next-reward-label">Next reward at {nextStreakReward.days}-day streak</div>
                <div className="prog-next-reward-name">{nextStreakReward.label}</div>
              </div>
            </div>
          )}
          <div className="prog-streak-dots">
            {[1,2,3,4,5,6,7].map(d => (
              <span
                key={d}
                className={`prog-streak-dot${currentStreak >= d ? ' active' : ''}`}
              />
            ))}
          </div>
        </section>

        {/* ══ NEXT MILESTONE ════════════════════════════════════════════ */}
        {nextMilestone && (
          <section className="prog-card prog-card--milestone">
            <SectionTitle>🎯 Next Major Goal</SectionTitle>
            <div className="prog-milestone-body">
              <span className="prog-milestone-icon">{nextMilestone.icon}</span>
              <div>
                <div className="prog-milestone-target">Reach {nextMilestone.pct}% collection</div>
                <div className="prog-milestone-reward">Reward: {nextMilestone.reward}</div>
                <div className="prog-milestone-progress">
                  {completionPct}% / {nextMilestone.pct}%
                  <div className="prog-mini-bar-track" style={{ marginTop: '6px' }}>
                    <div
                      className="prog-mini-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.round((completionPct / nextMilestone.pct) * 100))}%`,
                        background: 'var(--accent)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ ACHIEVEMENTS ═══════════════════════════════════════════════ */}
        <section className="prog-card prog-card--wide">
          <SectionTitle>🏅 Achievements — {unlockedCount} / {ACHIEVEMENT_DEFS.length}</SectionTitle>
          <div className="prog-badge-grid">
            {ACHIEVEMENT_DEFS.map(({ goal, icon, name }) => {
              const unlocked = discoveredCount >= goal;
              return (
                <div key={goal} className={`prog-badge${unlocked ? ' unlocked' : ' locked'}`}>
                  <span className="prog-badge-icon">{unlocked ? icon : '🔒'}</span>
                  <span className="prog-badge-name">{name}</span>
                  <span className="prog-badge-req">{goal} species</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ RECENT DISCOVERIES ════════════════════════════════════════ */}
        {recentDiscoveries.length > 0 && (
          <section className="prog-card prog-card--wide">
            <SectionTitle>🕐 Recent Discoveries</SectionTitle>
            <div className="prog-recent-grid">
              {recentDiscoveries.map(({ id, entry, animal }) => {
                if (!animal) return null;
                const daysAgo = Math.floor((Date.now() - entry.discoveredAt) / 86_400_000);
                const when = daysAgo === 0 ? 'Today'
                           : daysAgo === 1 ? 'Yesterday'
                           : `${daysAgo}d ago`;
                return (
                  <div key={id} className="prog-recent-card">
                    <div className="prog-recent-img-wrap">
                      {entry.firstImageUrl
                        ? <img src={entry.firstImageUrl} alt={animal.name} className="prog-recent-img" loading="lazy" />
                        : <span className="prog-recent-emoji">{animal.emoji}</span>}
                    </div>
                    <span className="prog-recent-name">{animal.name}</span>
                    <span
                      className="prog-recent-rarity"
                      style={{ color: RARITY_COLORS[animal.speciesRarity] }}
                    >
                      {RARITY_ICONS[animal.speciesRarity]}
                    </span>
                    <span className="prog-recent-when">{when}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══ INVENTORY SUMMARY ══════════════════════════════════════════ */}
        <section className="prog-card">
          <SectionTitle>🎒 Inventory</SectionTitle>
          <div className="prog-inv-grid">
            {[
              { icon: '🎟️', label: 'Tickets',    val: totalTickets   },
              { icon: '🍀', label: 'Boosts',      val: totalBoosts    },
              { icon: '🎨', label: 'Themes',       val: unlockedThemes  },
              { icon: '✨', label: 'Effects',      val: unlockedEffects },
              { icon: '🏅', label: 'Titles',       val: inventory.earnedTitles.length },
              { icon: '🧭', label: 'Expeditions',  val: expeditionsDone },
            ].map(({ icon, label, val }) => (
              <div key={label} className="prog-inv-cell">
                <span className="prog-inv-icon">{icon}</span>
                <span className="prog-inv-val">{val}</span>
                <span className="prog-inv-label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ EQUIPPED COSMETICS ════════════════════════════════════════ */}
        <section className="prog-card">
          <SectionTitle>✨ Equipped</SectionTitle>
          <div className="prog-cosmetics-list">
            <div className="prog-cosmetic-row">
              <span className="prog-cosmetic-icon">🎨</span>
              <span className="prog-cosmetic-label">Theme</span>
              <span className="prog-cosmetic-val">{inventory.activeTheme}</span>
            </div>
            <div className="prog-cosmetic-row">
              <span className="prog-cosmetic-icon">✨</span>
              <span className="prog-cosmetic-label">Effect</span>
              <span className="prog-cosmetic-val">{inventory.activeEffect === 'none' ? 'None' : inventory.activeEffect}</span>
            </div>
            <div className="prog-cosmetic-row">
              <span className="prog-cosmetic-icon">🖼️</span>
              <span className="prog-cosmetic-label">Frame</span>
              <span className="prog-cosmetic-val">{inventory.activeFrame === 'none' ? 'None' : inventory.activeFrame}</span>
            </div>
            {activeTitle && (
              <div className="prog-cosmetic-row">
                <span className="prog-cosmetic-icon">{activeTitle.icon}</span>
                <span className="prog-cosmetic-label">Title</span>
                <span className="prog-cosmetic-val">{activeTitle.label}</span>
              </div>
            )}
          </div>
        </section>

        {/* ══ FAVORITE SPECIES ══════════════════════════════════════════ */}
        {topFav && topFavAnimal && (
          <section className="prog-card prog-fav-card">
            <SectionTitle>❤️ Favorite Species</SectionTitle>
            <div className="prog-fav-body">
              <div className="prog-fav-img-wrap">
                {topFav[1].firstImageUrl
                  ? <img src={topFav[1].firstImageUrl} alt={topFavAnimal.name} className="prog-fav-img" />
                  : <span className="prog-fav-emoji">{topFavAnimal.emoji}</span>}
              </div>
              <div className="prog-fav-info">
                <div className="prog-fav-name">{topFavAnimal.name}</div>
                <div
                  className="prog-fav-rarity"
                  style={{ color: RARITY_COLORS[topFavAnimal.speciesRarity] }}
                >
                  {RARITY_ICONS[topFavAnimal.speciesRarity]} {RARITY_LABELS[topFavAnimal.speciesRarity]}
                </div>
                <div className="prog-fav-stats">
                  <span>❤️ Faved {topFav[1].favoriteCount}×</span>
                  <span>🔭 Seen {topFav[1].encounterCount}×</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ COLLECTION MILESTONES ══════════════════════════════════════ */}
        <section className="prog-card prog-card--wide">
          <SectionTitle>🏆 Collection Milestones</SectionTitle>
          <div className="prog-milestones-list">
            {COLLECTION_MILESTONES.map((m) => {
              const done = completionPct >= m.pct;
              return (
                <div key={m.pct} className={`prog-milestone-row${done ? ' done' : ''}`}>
                  <span className="prog-milestone-row-icon">{done ? '✅' : m.icon}</span>
                  <div className="prog-milestone-row-body">
                    <span className="prog-milestone-row-pct">{m.pct}% Collection</span>
                    <span className="prog-milestone-row-reward">{m.reward}</span>
                  </div>
                  <span className={`prog-milestone-row-status${done ? ' done' : ''}`}>
                    {done ? 'Done' : `${completionPct}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ STATS GRID ════════════════════════════════════════════════ */}
        <section className="prog-card prog-card--wide">
          <SectionTitle>📊 Statistics</SectionTitle>
          <div className="prog-stats-grid">
            <div className="prog-stat-cell">
              <span className="prog-stat-num">{discoveredCount}</span>
              <span className="prog-stat-label">Species Found</span>
            </div>
            <div className="prog-stat-cell">
              <span className="prog-stat-num">{completionPct}%</span>
              <span className="prog-stat-label">Completion</span>
            </div>
            <div className="prog-stat-cell">
              <span className="prog-stat-num" style={{ color: RARITY_COLORS.rare }}>
                {rarityDiscovered.rare ?? 0}
              </span>
              <span className="prog-stat-label">🔵 Rare Found</span>
            </div>
            <div className="prog-stat-cell">
              <span className="prog-stat-num" style={{ color: RARITY_COLORS.epic }}>
                {rarityDiscovered.epic ?? 0}
              </span>
              <span className="prog-stat-label">🟣 Epic Found</span>
            </div>
            <div className="prog-stat-cell">
              <span className="prog-stat-num" style={{ color: RARITY_COLORS.exotic }}>
                {rarityDiscovered.exotic ?? 0}
              </span>
              <span className="prog-stat-label">🟠 Exotic Found</span>
            </div>
            <div className="prog-stat-cell">
              <span className="prog-stat-num" style={{ color: RARITY_COLORS.legendary }}>
                {rarityDiscovered.legendary ?? 0}
              </span>
              <span className="prog-stat-label">🟡 Legendary Found</span>
            </div>
            <div className="prog-stat-cell">
              <span className="prog-stat-num">{favCount}</span>
              <span className="prog-stat-label">Total Favorites</span>
            </div>
            <div className="prog-stat-cell">
              <span className="prog-stat-num">{expeditionsDone}</span>
              <span className="prog-stat-label">Expeditions Done</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
