import React from 'react';
import { useCollectionCtx, useFavCtx, useInventoryCtx } from '../context/AppContext';
import {
  ACHIEVEMENT_MILESTONES,
  getAchievementNextGoal,
  getAchievementsUnlocked,
  getCurrentStreak,
  getDiscoveryXP,
  getLevelInfo,
  getLongestStreak,
} from '../utils/progression';

export default function ProgressPage() {
  const { collection, discoveredCount, totalCount } = useCollectionCtx();
  const { count: favoritesCount } = useFavCtx();
  const { inventory } = useInventoryCtx();

  // Extract timestamps for streak calculations (progression utils expect Record<string, number>)
  const discoveredTimestamps = Object.fromEntries(
    Object.entries(collection).map(([id, e]) => [id, e.discoveredAt]),
  );

  const completionPct = totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0;
  const currentStreak = getCurrentStreak(discoveredTimestamps);
  const longestStreak = getLongestStreak(discoveredTimestamps);
  const xp = getDiscoveryXP(discoveredCount, currentStreak);
  const levelInfo = getLevelInfo(xp);
  const unlockedAchievements = getAchievementsUnlocked(discoveredCount);
  const nextAchievement = getAchievementNextGoal(discoveredCount);

  // Inventory stats
  const totalTickets = Object.values(inventory.tickets).reduce((s, v) => s + (v ?? 0), 0);
  const totalBoosts  = inventory.activeBoosts.filter((b) => b.remainingUses > 0).length;
  const unlockedThemes  = inventory.unlockedThemes.length - 1; // exclude 'default'
  const unlockedEffects = inventory.unlockedEffects.length - 1; // exclude 'none'

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>📊 Progress</h1>
        <p className="progress-subtitle">Your discovery dashboard: collection, streaks, rewards, and milestones.</p>
      </div>

      <section className="progress-section">
        <h2>📖 Collection Progress</h2>
        <div className="progress-overview-cards">
          <div className="prog-stat-card">
            <div className="prog-stat-num">{discoveredCount}</div>
            <div className="prog-stat-label">Species Discovered</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{completionPct}%</div>
            <div className="prog-stat-label">Completion</div>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="progress-bar-label">{discoveredCount} / {totalCount}</span>
        </div>
      </section>

      <section className="progress-section">
        <h2>🔥 Discovery Streak</h2>
        <div className="progress-overview-cards">
          <div className="prog-stat-card">
            <div className="prog-stat-num">{currentStreak}</div>
            <div className="prog-stat-label">Current Streak</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{longestStreak}</div>
            <div className="prog-stat-label">Longest Streak</div>
          </div>
        </div>
      </section>

      <section className="progress-section">
        <h2>🏆 Achievements</h2>
        <div className="progress-overview-cards">
          <div className="prog-stat-card highlight">
            <div className="prog-stat-num">{unlockedAchievements}</div>
            <div className="prog-stat-label">Unlocked Achievements</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{ACHIEVEMENT_MILESTONES.length}</div>
            <div className="prog-stat-label">Total Achievement Tracks</div>
          </div>
        </div>

        <p className="progress-note">
          {nextAchievement
            ? `${nextAchievement - discoveredCount} more discoveries to unlock the next achievement milestone.`
            : 'All current achievement milestones unlocked.'}
        </p>
      </section>

      <section className="progress-section">
        <h2>✨ Discovery Progress</h2>
        <div className="progress-overview-cards">
          <div className="prog-stat-card">
            <div className="prog-stat-num">{xp}</div>
            <div className="prog-stat-label">XP</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{levelInfo.level}</div>
            <div className="prog-stat-label">Level</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{levelInfo.progressPct}%</div>
            <div className="prog-stat-label">Next Level Progress</div>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${levelInfo.progressPct}%` }}
            />
          </div>
          <span className="progress-bar-label">
            {levelInfo.xpInLevel} / {levelInfo.xpNeededForNextLevel} XP
          </span>
        </div>

        <p className="progress-note">Levels unlock new profile titles, reveal effects, and visual themes.</p>
      </section>

      <section className="progress-section">
        <h2>🎟️ Expedition Rewards</h2>
        <div className="progress-overview-cards">
          <div className="prog-stat-card">
            <div className="prog-stat-num">{totalTickets}</div>
            <div className="prog-stat-label">Encounter Tickets</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{totalBoosts}</div>
            <div className="prog-stat-label">Active Boosts</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{unlockedThemes}</div>
            <div className="prog-stat-label">Themes Unlocked</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{unlockedEffects}</div>
            <div className="prog-stat-label">Effects Unlocked</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{inventory.earnedTitles.length}</div>
            <div className="prog-stat-label">Titles Earned</div>
          </div>
          <div className="prog-stat-card">
            <div className="prog-stat-num">{inventory.claimedQuestIds.length}</div>
            <div className="prog-stat-label">Expeditions Done</div>
          </div>
        </div>

        <p className="progress-note">
          Rewards are designed for gameplay impact: better rarity hunts, missing-species discovery, and cosmetic unlocks.
        </p>
      </section>
    </div>
  );
}
