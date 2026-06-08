import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCollectionCtx, useFavCtx, useThemeCtx, useInventoryCtx } from '../context/AppContext';
import { getAchievementsUnlocked, getCurrentStreak, getDiscoveryXP, getLevelInfo } from '../utils/progression';
import { TITLE_DEF_MAP } from '../data/rewardDefinitions';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { count } = useFavCtx();
  const { collection, discoveredCount } = useCollectionCtx();
  const { theme, toggleTheme } = useThemeCtx();
  const { inventory } = useInventoryCtx();
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const discoveredTimestamps = Object.fromEntries(
    Object.entries(collection).map(([id, e]) => [id, e.discoveredAt]),
  );
  const streak = getCurrentStreak(discoveredTimestamps);
  const xp = getDiscoveryXP(discoveredCount, streak);
  const level = getLevelInfo(xp).level;
  const achievements = getAchievementsUnlocked(discoveredCount);

  const activeTitle = inventory.activeTitle ? TITLE_DEF_MAP.get(inventory.activeTitle) : null;
  const ticketCount = Object.values(inventory.tickets).reduce((s, n) => s + (n ?? 0), 0);
  const pendingTicket = inventory.pendingTicketMinRarity;

  const profileLabel = isGuest
    ? 'Guest Explorer'
    : (user?.displayName ?? user?.email ?? 'Explorer');

  return (
    <>
      <header className="header">
        <div className="header__logo">
          <span className="header__logo-icon">🐾</span>
          <span>PetTube</span>
        </div>

        <nav className="header__nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>
            🔍 Discover
          </NavLink>
          <NavLink to="/collection" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>
            📖 Collection
          </NavLink>
          <NavLink to="/expeditions" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>
            🧭 Expeditions
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>
            🎒 Inventory
            {ticketCount > 0 && <span className="fav-badge">{ticketCount > 9 ? '9+' : ticketCount}</span>}
          </NavLink>
          <NavLink to="/progress" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>
            📊 Progress
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>
            ❤️ Favorites
            {count > 0 && <span className="fav-badge">{count > 99 ? '99+' : count}</span>}
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'} title="Settings">
            ⚙️
          </NavLink>
          <button className="theme-btn" onClick={() => setProfileOpen((v) => !v)} title="Open profile" aria-label="Open profile">
            👤
          </button>
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle dark/light mode">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>

      {/* Guest upgrade nudge — shown once above the nav */}
      {isGuest && (
        <div className="guest-nudge-bar">
          <span>☁️ Playing as <strong>Guest Explorer</strong> — progress is saved locally only.</span>
          <button className="guest-nudge-btn" onClick={() => navigate('/upgrade')}>
            Create Free Account →
          </button>
        </div>
      )}

      {pendingTicket && (
        <div className="header-ticket-banner">
          🎟️ <strong>{pendingTicket.charAt(0).toUpperCase() + pendingTicket.slice(1)}+ Ticket Active</strong>
          &nbsp;— next discovery is guaranteed {pendingTicket.charAt(0).toUpperCase() + pendingTicket.slice(1)} or better
        </div>
      )}

      {profileOpen && (
        <aside className="profile-drawer" role="dialog" aria-label="Profile summary">
          <div className="profile-drawer-header">
            <h3>👤 {profileLabel}</h3>
            <button className="search-close" onClick={() => setProfileOpen(false)}>Close</button>
          </div>
          {isGuest && (
            <button
              className="profile-upgrade-btn"
              onClick={() => { setProfileOpen(false); navigate('/upgrade'); }}
            >
              ☁️ Save Progress — Create Account
            </button>
          )}
          {activeTitle && (
            <div className="profile-title-badge">
              <span>{activeTitle.icon}</span>
              <span>{activeTitle.label}</span>
            </div>
          )}
          <div className="profile-drawer-grid">
            <div className="profile-mini-stat">
              <span>Species Discovered</span>
              <strong>{discoveredCount}</strong>
            </div>
            <div className="profile-mini-stat">
              <span>Current Streak</span>
              <strong>{streak}</strong>
            </div>
            <div className="profile-mini-stat">
              <span>Level</span>
              <strong>{level}</strong>
            </div>
            <div className="profile-mini-stat">
              <span>Achievements</span>
              <strong>{achievements}</strong>
            </div>
          </div>
          <p className="profile-drawer-note">Quick summary only. Full stats live in Progress.</p>
        </aside>
      )}
      {profileOpen && (
        <button
          className="profile-drawer-backdrop"
          aria-label="Close profile"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}

