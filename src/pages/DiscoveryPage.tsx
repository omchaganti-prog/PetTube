import React, { useEffect, useRef, useState, useCallback } from 'react';
import DiscoveryCard from '../components/DiscoveryCard';
import DiscoveryPopup from '../components/DiscoveryPopup';
import { useDiscovery } from '../hooks/useDiscovery';
import { useNotifCtx, useCollectionCtx, useInventoryCtx } from '../context/AppContext';
import { REGISTRY_BY_ID } from '../data/animalRegistry';
import { EFFECT_DEF_MAP } from '../data/rewardDefinitions';
import type { AnimalImage } from '../types';

/* ── Mystery card shown during the reveal animation ── */
function MysteryCard({ phase }: { phase: 'waiting' | 'revealing' }) {
  return (
    <div className={`mystery-card${phase === 'revealing' ? ' mystery-card--exit' : ''}`}>
      <div className="mystery-ring" />
      <div className="mystery-question">❓</div>
      <div className="mystery-paws">🐾&nbsp;&nbsp;🐾&nbsp;&nbsp;🐾</div>
      <div className="mystery-label">Discovering…</div>
    </div>
  );
}

export default function DiscoveryPage() {
  const { markDiscovered, discoveredCount, totalCount } = useCollectionCtx();
  const { inventory } = useInventoryCtx();
  const {
    current, revealing, poolReady,
    nextAnimal,
  } = useDiscovery();
  const { showNotification } = useNotifCtx();
  const prevGenId = useRef<string | null>(null);
  const [popupAnimal, setPopupAnimal] = useState<AnimalImage | null>(null);

  const closePopup = useCallback(() => setPopupAnimal(null), []);

  // Effect CSS class for the reveal animation
  const effectDef = EFFECT_DEF_MAP.get(inventory.activeEffect);
  const effectClass = effectDef?.cssClass ?? '';

  useEffect(() => {
    if (!current || current.id === prevGenId.current) return;
    prevGenId.current = current.id;

    // Use current.category (species id like "dogs") — NOT current.id (generation uid)
    const isNew = markDiscovered(current.category);

    if (isNew) {
      setPopupAnimal(current);
    }

    if (current.rarity === 'legendary') {
      const entry = REGISTRY_BY_ID.get(current.category);
      showNotification(
        `🌟 LEGENDARY! You found ${entry?.emoji ?? ''} ${entry?.name ?? current.title}! 🎉`,
        'success',
      );
    } else if (current.rarity === 'exotic') {
      const entry = REGISTRY_BY_ID.get(current.category);
      showNotification(
        `🟠 Exotic find! ${entry?.emoji ?? ''} ${entry?.name ?? current.title} is very rare!`,
        'success',
      );
    }
  }, [current, markDiscovered, showNotification]);

  /* Pool still warming up — show mystery placeholder */
  if (!poolReady || !current) {
    return (
      <div className="discovery-page">
        <MysteryCard phase="waiting" />
        <p className="discovery-loading-hint">Finding animals…</p>
      </div>
    );
  }

  return (
    <div className="discovery-page">
      {/* ── Main card / mystery overlay ── */}
      <div className={`discovery-card-scene${effectClass ? ` ${effectClass}` : ''}`}>
        {revealing ? (
          <MysteryCard phase="revealing" />
        ) : (
          <DiscoveryCard key={current.id} animal={current} />
        )}
      </div>

      {/* ── Primary action ── */}
      <nav className="discovery-nav" aria-label="Animal navigation">
        <button
          className="discovery-next-btn"
          onClick={() => nextAnimal()}
          disabled={revealing}
          aria-label="Next discovery"
        >
          Next Discovery&nbsp;➡
        </button>
      </nav>

      {/* ── New species popup ── */}
      {popupAnimal && (
        <DiscoveryPopup
          animal={popupAnimal}
          discoveredCount={discoveredCount}
          totalCount={totalCount}
          onClose={closePopup}
        />
      )}
    </div>
  );
}
