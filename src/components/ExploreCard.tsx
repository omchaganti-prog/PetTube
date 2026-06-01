import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { AnimalImage } from '../types';
import { RARITY_ICONS, RARITY_COLORS } from '../constants';
import { getFallbackUrl } from '../services/imagePool';

interface Props {
  animal: AnimalImage;
}

export function ExploreCard({ animal }: Props) {
  const navigate = useNavigate();

  return (
    <button
      className="explore-card"
      onClick={() => navigate(`/?category=${animal.category}`)}
      title={animal.title}
    >
      <div className="explore-card-img-wrap">
        {/* Blurred background — fills space around the fully-visible animal */}
        <img src={animal.url} aria-hidden="true" className="img-blur-bg" alt="" />
        <img
          src={animal.url}
          alt={animal.title}
          className="explore-card-img"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = getFallbackUrl(animal.category);
          }}
        />
        <span
          className="explore-card-rarity"
          style={{ color: RARITY_COLORS[animal.rarity] }}
        >
          {RARITY_ICONS[animal.rarity]}
        </span>
      </div>
      <div className="explore-card-info">
        <span className="explore-card-title">{animal.title}</span>
      </div>
    </button>
  );
}
