import React, { useState } from 'react';
import { useCollectionCtx } from '../context/AppContext';
import { ANIMAL_REGISTRY } from '../data/animalRegistry';
import { RARITY_COLORS, RARITY_ICONS, RARITY_LABELS, RARITY_ORDER } from '../constants';
import type { Rarity } from '../types';

type FilterMode = 'all' | 'discovered';

export default function CollectionPage() {
  const { collection, discoveredCount, totalCount, discoveredByRarity } = useCollectionCtx();
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  const pct = totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0;

  const displayAnimals = ANIMAL_REGISTRY.filter((entry) => {
    if (filterMode === 'discovered' && !collection[entry.id]) return false;
    if (rarityFilter !== 'all' && entry.speciesRarity !== rarityFilter) return false;
    return true;
  });

  return (
    <div className="collection-page">
      {/* ── Header ── */}
      <div className="collection-header">
        <h1>📖 My Collection</h1>
        <p className="collection-subtitle">Your Pokédex of discovered species</p>

        {/* Master progress bar */}
        <div className="coll-progress-wrap">
          <div className="coll-progress-bar">
            <div className="coll-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="coll-progress-label">
            {discoveredCount} / {totalCount} Species — {pct}%
          </div>
        </div>

        {/* Stats row */}
        <div className="collection-stats-row">
          <div className="collection-stat">
            <span className="stat-num">{discoveredCount}</span>
            <span className="stat-label">Discovered</span>
          </div>
          <div className="collection-stat">
            <span className="stat-num">{totalCount - discoveredCount}</span>
            <span className="stat-label">Remaining</span>
          </div>
          <div className="collection-stat">
            <span className="stat-num">{pct}%</span>
            <span className="stat-label">Complete</span>
          </div>
        </div>

        {/* Per-rarity breakdown */}
        <div className="collection-rarity-summary">
          {RARITY_ORDER.map((r: Rarity) => {
            const found = discoveredByRarity(r);
            const total_ = ANIMAL_REGISTRY.filter((e) => e.speciesRarity === r).length;
            return (
              <div
                key={r}
                className="rarity-summary-pill"
                style={{ borderColor: RARITY_COLORS[r] }}
              >
                <span>{RARITY_ICONS[r]}</span>
                <span style={{ color: RARITY_COLORS[r] }}>{RARITY_LABELS[r]}</span>
                <span className="rarity-count">{found}/{total_}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="collection-filters">
        <div className="coll-filter-row">
          <button
            className={`coll-filter-btn${filterMode === 'all' ? ' active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All Species ({totalCount})
          </button>
          <button
            className={`coll-filter-btn${filterMode === 'discovered' ? ' active' : ''}`}
            onClick={() => setFilterMode('discovered')}
          >
            ✓ Discovered ({discoveredCount})
          </button>
        </div>
        <div className="coll-filter-row">
          <button
            className={`coll-filter-btn${rarityFilter === 'all' ? ' active' : ''}`}
            onClick={() => setRarityFilter('all')}
          >
            All Rarities
          </button>
          {RARITY_ORDER.map((r: Rarity) => (
            <button
              key={r}
              className={`coll-filter-btn${rarityFilter === r ? ' active' : ''}`}
              style={rarityFilter === r ? { borderColor: RARITY_COLORS[r], color: RARITY_COLORS[r] } : {}}
              onClick={() => setRarityFilter(r)}
            >
              {RARITY_ICONS[r]} {RARITY_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {displayAnimals.length === 0 ? (
        <div className="empty-state">
          <h2>Nothing here yet</h2>
          <p>Head to Discover to start your collection!</p>
        </div>
      ) : (
        <div className="collection-grid">
          {displayAnimals.map((entry) => {
            const speciesEntry = collection[entry.id];
            const isFound = Boolean(speciesEntry);
            const rarityColor = RARITY_COLORS[entry.speciesRarity];

            if (!isFound) {
              return (
                <div key={entry.id} className="collection-card undiscovered">
                  <div className="coll-card-mystery">❓</div>
                  <div className="coll-card-unknown">Unknown</div>
                </div>
              );
            }

            return (
              <div
                key={entry.id}
                className="collection-card found"
                style={{ borderColor: rarityColor }}
              >
                <div className="collection-card-check">✓</div>
                <div className="collection-card-emoji">{entry.emoji}</div>
                <div className="collection-card-name">{entry.name}</div>
                <div
                  className="collection-card-rarity"
                  style={{ color: rarityColor }}
                >
                  {RARITY_ICONS[entry.speciesRarity]}&nbsp;{RARITY_LABELS[entry.speciesRarity]}
                </div>
                <div className="coll-card-meta">
                  <div className="coll-meta-row">
                    <span className="coll-meta-label">Discovered</span>
                    <span className="coll-meta-value">
                      {new Date(speciesEntry.discoveredAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="coll-meta-row">
                    <span className="coll-meta-label">Encounters</span>
                    <span className="coll-meta-value">{speciesEntry.encounterCount}</span>
                  </div>
                  {speciesEntry.favoriteCount > 0 && (
                    <div className="coll-meta-row">
                      <span className="coll-meta-label">❤️ Faved</span>
                      <span className="coll-meta-value">{speciesEntry.favoriteCount}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
