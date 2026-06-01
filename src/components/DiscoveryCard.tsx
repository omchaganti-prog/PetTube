import React, { useState, useEffect, useRef } from 'react';
import type { AnimalImage } from '../types';
import { RARITY_LABELS, RARITY_COLORS, RARITY_ICONS } from '../constants';
import { useFavCtx, useNotifCtx, useCollectionCtx } from '../context/AppContext';
import { getFallbackUrl } from '../services/imagePool';
import { shareImage } from '../utils/imageUtils';

interface Props {
  animal: AnimalImage;
}

const LOAD_TIMEOUT_MS = 8000;
const MAX_RETRIES = 4;
const SCIENTIFIC_NAMES: Record<string, string> = {
  dogs: 'Canis lupus familiaris',
  cats: 'Felis catus',
  rabbits: 'Oryctolagus cuniculus',
  ducks: 'Anas platyrhynchos',
  foxes: 'Vulpes vulpes',
  otters: 'Lutrinae',
  penguins: 'Spheniscidae',
  koalas: 'Phascolarctos cinereus',
  sloths: 'Folivora',
};

export default function DiscoveryCard({ animal }: Props) {
  const { isFavorite, toggleFavorite } = useFavCtx();
  const { showNotification } = useNotifCtx();
  const { incrementFavorite, decrementFavorite } = useCollectionCtx();

  const [imgSrc, setImgSrc] = useState(animal.url);
  const [imgLoaded, setImgLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryRef = useRef(0);

  // Reset state when the animal changes
  useEffect(() => {
    setImgSrc(animal.url);
    setImgLoaded(false);
    retryRef.current = 0;
  }, [animal.id]);

  // Timeout fallback: swap to next source if img hasn't loaded
  useEffect(() => {
    if (imgLoaded) return;
    timerRef.current = setTimeout(() => {
      if (retryRef.current < MAX_RETRIES) {
        retryRef.current += 1;
        setImgLoaded(false);
        setImgSrc(getFallbackUrl(animal.category));
      }
    }, LOAD_TIMEOUT_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgSrc, imgLoaded]);

  function handleLoad() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setImgLoaded(true);
  }

  function handleError() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (retryRef.current < MAX_RETRIES) {
      retryRef.current += 1;
      setImgSrc(getFallbackUrl(animal.category));
    }
  }

  function handleFav() {
    const wasFav = isFavorite(animal.id);
    toggleFavorite(animal);
    if (wasFav) {
      decrementFavorite(animal.category);
    } else {
      incrementFavorite(animal.category);
    }
    showNotification(
      wasFav
        ? `Removed ${animal.title} from favorites`
        : `${animal.title} saved! ❤️`,
      wasFav ? 'info' : 'success',
    );
  }

  const rarity = animal.rarity ?? 'common';
  const rarityColor = RARITY_COLORS[rarity];
  const rarityLabel = RARITY_LABELS[rarity];
  const rarityIcon = RARITY_ICONS[rarity];
  const fav = isFavorite(animal.id);
  const scientificName = SCIENTIFIC_NAMES[animal.category];

  function handleShare() {
    shareImage(animal.url, animal.title);
    showNotification(`Share link ready for ${animal.title}!`, 'success');
  }

  return (
    <article
      className={
        'discovery-animal-card' +
        (rarity === 'legendary' ? ' legendary-reveal' : '') +
        (rarity === 'exotic' ? ' exotic-reveal' : '')
      }
      aria-label={animal.title}
    >
      {/* ── Image ─────────────────────────────────── */}
      <div className="discovery-image-wrap">
        {/* Blurred background — fills space around the fully-visible animal */}
        <img src={imgSrc} aria-hidden="true" className="img-blur-bg" alt="" />
        {!imgLoaded && <div className="discovery-img-skeleton" />}
        <img
          src={imgSrc}
          alt={animal.title}
          className="discovery-img-main"
          onLoad={handleLoad}
          onError={handleError}
          style={{ opacity: imgLoaded ? 1 : 0, display: 'block' }}
        />
        <div className="discovery-img-gradient" />

        {/* Rarity badge */}
        <div
          className={`rarity-badge rarity-${rarity}`}
          style={{ background: `${rarityColor}cc` }}
          aria-label={`Rarity: ${rarityLabel}`}
        >
          <span>{rarityIcon}</span>
          <span>{rarityLabel}</span>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────── */}
      <div className="discovery-body">
        <h2 className="discovery-title">{animal.title}</h2>
        {scientificName && <p className="discovery-scientific">{scientificName}</p>}

        <div className="discovery-fact" role="note" aria-label="Animal fact">
          💡 {animal.fact}
        </div>

        {/* Action buttons */}
        <div className="discovery-actions">
          <button
            className={`discovery-action-btn${fav ? ' active' : ''}`}
            onClick={handleFav}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span>{fav ? '❤️' : '🤍'}</span>
            <span>{fav ? 'Saved' : 'Save'}</span>
          </button>

          <button
            className="discovery-action-btn"
            onClick={handleShare}
            aria-label={`Share ${animal.title}`}
          >
            <span>📤</span>
            <span>Share</span>
          </button>
        </div>
      </div>
    </article>
  );
}
