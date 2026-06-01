import React, { useState } from 'react';
import { useInventoryCtx } from '../context/AppContext';
import { TICKET_DEFS, BOOST_DEFS, THEME_DEFS, EFFECT_DEFS, TITLE_DEFS, BOOST_DEF_MAP } from '../data/rewardDefinitions';
import type { TicketType, AppThemeId, EffectType, TitleId, ActiveBoost } from '../types';
import { RARITY_COLORS } from '../constants';

type Tab = 'tickets' | 'boosts' | 'themes' | 'effects' | 'titles';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'tickets',  icon: '🎟️', label: 'Tickets'  },
  { id: 'boosts',   icon: '🍀', label: 'Boosts'   },
  { id: 'themes',   icon: '🎨', label: 'Themes'   },
  { id: 'effects',  icon: '✨', label: 'Effects'  },
  { id: 'titles',   icon: '🏅', label: 'Titles'   },
];

// ── Sub-components ────────────────────────────────────────────────────────

function PendingBanner() {
  const { inventory, cancelTicket } = useInventoryCtx();
  const { pendingTicketMinRarity: pending } = inventory;
  if (!pending) return null;

  const color = RARITY_COLORS[pending] ?? '#eab308';
  const label = pending.charAt(0).toUpperCase() + pending.slice(1);

  return (
    <div className="inv-pending-banner" style={{ borderColor: color }}>
      <span className="inv-pending-icon">🎟️</span>
      <div>
        <strong style={{ color }}>{label}+ Ticket Active</strong>
        <p>Your next discovery is guaranteed {label} or better.</p>
      </div>
      <button className="inv-cancel-ticket" onClick={cancelTicket} title="Cancel ticket">
        ✕ Cancel
      </button>
    </div>
  );
}

function BoostProgress({ boost }: { boost: ActiveBoost }) {
  const def = BOOST_DEF_MAP.get(boost.type);
  if (!def) return null;
  const pct = Math.round((boost.remainingUses / boost.totalUses) * 100);
  return (
    <div className="inv-boost-item">
      <div className="inv-boost-header">
        <span className="inv-boost-icon">{def.icon}</span>
        <div>
          <strong>{def.name}</strong>
          <p>{def.description}</p>
        </div>
        <span className="inv-boost-uses">{boost.remainingUses}/{boost.totalUses}</span>
      </div>
      <div className="inv-boost-bar-track">
        <div className="inv-boost-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Tickets tab ───────────────────────────────────────────────────────────

function TicketsTab() {
  const { inventory, useTicket } = useInventoryCtx();

  const total = Object.values(inventory.tickets).reduce((s, n) => s + (n ?? 0), 0);

  return (
    <div className="inv-section">
      {total === 0 && (
        <div className="inv-empty">
          <span>🎟️</span>
          <p>No tickets yet. Complete Expeditions to earn Encounter Tickets!</p>
        </div>
      )}

      {TICKET_DEFS.map((def) => {
        const count = inventory.tickets[def.id] ?? 0;
        if (count === 0) return null;
        return (
          <div key={def.id} className="inv-ticket-item">
            <div className="inv-ticket-left">
              <span className="inv-ticket-icon">{def.icon}</span>
              <div>
                <strong>{def.name}</strong>
                <p>{def.description}</p>
              </div>
            </div>
            <div className="inv-ticket-right">
              <span className="inv-ticket-count">×{count}</span>
              <button
                className="inv-use-btn"
                onClick={() => useTicket(def.id as TicketType)}
                disabled={!!inventory.pendingTicketMinRarity}
                title={inventory.pendingTicketMinRarity ? 'A ticket is already active' : 'Use this ticket'}
              >
                Use Ticket
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Boosts tab ────────────────────────────────────────────────────────────

function BoostsTab() {
  const { inventory } = useInventoryCtx();
  const active = inventory.activeBoosts.filter((b) => b.remainingUses > 0);

  return (
    <div className="inv-section">
      {active.length === 0 && (
        <div className="inv-empty">
          <span>🍀</span>
          <p>No active boosts. Complete Expeditions to earn Discovery Boosts!</p>
        </div>
      )}
      {active.map((boost, i) => (
        <BoostProgress key={i} boost={boost} />
      ))}

      <div className="inv-boost-legend">
        <h3>Boost Types</h3>
        {BOOST_DEFS.map((def) => (
          <div key={def.id} className="inv-boost-legend-item">
            <span>{def.icon}</span>
            <div>
              <strong>{def.name}</strong>
              <p>{def.description} ({def.durationLabel})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Themes tab ────────────────────────────────────────────────────────────

function ThemesTab() {
  const { inventory, activateTheme } = useInventoryCtx();

  return (
    <div className="inv-section inv-grid">
      {THEME_DEFS.map((def) => {
        const unlocked = inventory.unlockedThemes.includes(def.id);
        const active   = inventory.activeTheme === def.id;
        return (
          <div
            key={def.id}
            className={`inv-theme-card${active ? ' inv-theme-card--active' : ''}${!unlocked ? ' inv-theme-card--locked' : ''}`}
          >
            <span className="inv-theme-icon">{def.icon}</span>
            <strong>{def.name}</strong>
            <p>{def.description}</p>
            {unlocked ? (
              active ? (
                <span className="inv-badge-active">Active</span>
              ) : (
                <button className="inv-equip-btn" onClick={() => activateTheme(def.id as AppThemeId)}>
                  Equip
                </button>
              )
            ) : (
              <span className="inv-badge-locked">🔒 Locked</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Effects tab ───────────────────────────────────────────────────────────

function EffectsTab() {
  const { inventory, activateEffect } = useInventoryCtx();

  return (
    <div className="inv-section inv-grid">
      {EFFECT_DEFS.map((def) => {
        const unlocked = inventory.unlockedEffects.includes(def.id);
        const active   = inventory.activeEffect === def.id;
        return (
          <div
            key={def.id}
            className={`inv-effect-card${active ? ' inv-effect-card--active' : ''}${!unlocked ? ' inv-effect-card--locked' : ''}`}
          >
            <span className="inv-effect-icon">{def.icon}</span>
            <strong>{def.name}</strong>
            <p>{def.description}</p>
            {unlocked ? (
              active ? (
                <span className="inv-badge-active">Active</span>
              ) : (
                <button className="inv-equip-btn" onClick={() => activateEffect(def.id as EffectType)}>
                  Equip
                </button>
              )
            ) : (
              <span className="inv-badge-locked">🔒 Locked</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Titles tab ────────────────────────────────────────────────────────────

function TitlesTab() {
  const { inventory, equipTitle, unequipTitle } = useInventoryCtx();

  return (
    <div className="inv-section">
      {TITLE_DEFS.map((def) => {
        const earned = inventory.earnedTitles.includes(def.id);
        const active = inventory.activeTitle === def.id;
        return (
          <div key={def.id} className={`inv-title-item${active ? ' inv-title-item--active' : ''}${!earned ? ' inv-title-item--locked' : ''}`}>
            <div className="inv-title-left">
              <span className="inv-title-icon">{def.icon}</span>
              <div>
                <strong>{def.label}</strong>
                <p>{def.description}</p>
                {!earned && <em className="inv-title-unlock-hint">{def.autoUnlock}</em>}
              </div>
            </div>
            {earned && (
              active ? (
                <button className="inv-equip-btn inv-equip-btn--unequip" onClick={unequipTitle}>
                  Unequip
                </button>
              ) : (
                <button className="inv-equip-btn" onClick={() => equipTitle(def.id as TitleId)}>
                  Equip
                </button>
              )
            )}
            {!earned && <span className="inv-badge-locked">🔒</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [tab, setTab] = useState<Tab>('tickets');
  const { inventory } = useInventoryCtx();

  // Counts for tab badges
  const ticketCount  = Object.values(inventory.tickets).reduce((s, n) => s + (n ?? 0), 0);
  const boostCount   = inventory.activeBoosts.filter((b) => b.remainingUses > 0).length;

  return (
    <div className="inv-page">
      <div className="inv-header">
        <h1>🎒 Inventory</h1>
        <p className="inv-subtitle">Earn rewards from Expeditions. Use them to discover rarer animals and customize your experience.</p>
      </div>

      <PendingBanner />

      <div className="inv-tabs" role="tablist">
        {TABS.map(({ id, icon, label }) => {
          const badge = id === 'tickets' ? ticketCount : id === 'boosts' ? boostCount : 0;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              className={`inv-tab${tab === id ? ' inv-tab--active' : ''}`}
              onClick={() => setTab(id)}
            >
              {icon} {label}
              {badge > 0 && <span className="inv-tab-badge">{badge}</span>}
            </button>
          );
        })}
      </div>

      <div className="inv-body" role="tabpanel">
        {tab === 'tickets' && <TicketsTab />}
        {tab === 'boosts'  && <BoostsTab  />}
        {tab === 'themes'  && <ThemesTab  />}
        {tab === 'effects' && <EffectsTab />}
        {tab === 'titles'  && <TitlesTab  />}
      </div>
    </div>
  );
}
