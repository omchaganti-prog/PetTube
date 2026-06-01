import React, { useEffect, useRef } from 'react';
import type { AnimalImage } from '../types';
import { RARITY_COLORS, RARITY_ICONS, RARITY_LABELS } from '../constants';
import { REGISTRY_BY_ID } from '../data/animalRegistry';

interface Props {
  animal: AnimalImage;
  discoveredCount: number;
  totalCount: number;
  onClose: () => void;
}

const AUTO_CLOSE_MS = 5500;

export default function DiscoveryPopup({ animal, discoveredCount, totalCount, onClose }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [onClose]);

  const entry = REGISTRY_BY_ID.get(animal.category);
  const rarity = animal.rarity ?? 'common';
  const rarityColor = RARITY_COLORS[rarity];
  const pct = totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0;

  return (
    <div
      className="dpopup-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="New species discovered"
    >
      <div
        className={`dpopup dpopup--${rarity}`}
        style={{ borderColor: rarityColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dpopup-header">
          <span className="dpopup-celebrate" aria-hidden="true">🎉</span>
          <span className="dpopup-headline">NEW SPECIES DISCOVERED</span>
          <span className="dpopup-celebrate" aria-hidden="true">🎉</span>
        </div>

        {/* Animal image */}
        <div className="dpopup-img-wrap">
          <img
            src={animal.url}
            alt={entry?.name ?? animal.title}
            className="dpopup-img"
          />
          <div
            className="dpopup-img-glow"
            style={{ background: `radial-gradient(circle, ${rarityColor}55 0%, transparent 70%)` }}
          />
        </div>

        {/* Name */}
        <div className="dpopup-name">
          {entry?.emoji && <span className="dpopup-emoji">{entry.emoji}</span>}
          {entry?.name ?? animal.title}
        </div>

        {/* Rarity */}
        <div className="dpopup-rarity" style={{ color: rarityColor }}>
          {RARITY_ICONS[rarity]}&nbsp;{RARITY_LABELS[rarity]}
        </div>

        {/* Collection progress */}
        <div className="dpopup-progress">
          <div className="dpopup-progress-label">
            {discoveredCount}&nbsp;/&nbsp;{totalCount} Species Found
          </div>
          <div className="dpopup-bar">
            <div
              className="dpopup-bar-fill"
              style={{ width: `${pct}%`, background: rarityColor }}
            />
          </div>
          <div className="dpopup-pct">{pct}% complete</div>
        </div>

        {/* Dismiss */}
        <button className="dpopup-close" onClick={onClose}>
          Continue Exploring ➡
        </button>
      </div>
    </div>
  );
}
