import React, { useState, useEffect, useCallback } from 'react';
import FilterBar from '../components/FilterBar';
import AnimalCard from '../components/AnimalCard';
import FactTicker from '../components/FactTicker';
import { useFeed } from '../hooks/useFeed';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useNotifCtx } from '../context/AppContext';
import { getDailyAnimal, formatCategory } from '../utils/imageUtils';
import { FILTER_LABELS, CATEGORY_EMOJIS } from '../constants';
import type { AnimalImage, AnimalCategory } from '../types';

export default function FeedPage() {
  const {
    images, filter, loading, surpriseMode,
    applyFilter, loadMore, activateSurprise, filterByCategory,
  } = useFeed();
  const { showNotification } = useNotifCtx();

  const [showSurpriseOverlay, setShowSurpriseOverlay] = useState(false);
  const dailyAnimal = getDailyAnimal();

  const sentinelRef = useIntersectionObserver(loadMore);

  const handleMoreLikeThis = useCallback(
    (image: AnimalImage) => {
      filterByCategory(image.category as AnimalCategory);
      const label = FILTER_LABELS[image.category];
      showNotification(`Showing only ${label} 🔍`, 'info');
    },
    [filterByCategory, showNotification]
  );

  const handleSurprise = () => {
    setShowSurpriseOverlay(true);
    activateSurprise();
    showNotification('🎉 Surprise mode activated! Enjoy the randomness!', 'success');
    setTimeout(() => setShowSurpriseOverlay(false), 700);
  };

  // Stagger card animation
  const cardStyle = (i: number): React.CSSProperties => ({
    animationDelay: `${(i % 12) * 0.05}s`,
  });

  return (
    <>
      {showSurpriseOverlay && <div className="surprise-overlay" aria-hidden />}

      <FactTicker />

      {/* Daily featured */}
      <div className="daily-banner">
        <span className="daily-banner__emoji">{CATEGORY_EMOJIS[dailyAnimal]}</span>
        <div>
          <div className="daily-banner__label">🌟 Daily Featured</div>
          <div className="daily-banner__title">{formatCategory(dailyAnimal)} of the Day!</div>
        </div>
      </div>

      <FilterBar active={filter} onSelect={applyFilter} />

      <div className="action-row">
        <button className="surprise-btn" onClick={handleSurprise} aria-label="Surprise me with random animals">
          🎲 Surprise Me!
        </button>
        {filter !== 'all' && (
          <button className="clear-filter-btn" onClick={() => applyFilter('all')} aria-label="Show all animals">
            ✕ All Animals
          </button>
        )}
        {surpriseMode && (
          <button className="clear-filter-btn" onClick={() => applyFilter('all')} aria-label="Exit surprise mode">
            ✕ Exit Surprise
          </button>
        )}
      </div>

      <div className="feed-container">
        <div className="image-grid">
          {images.map((img, i) => (
            <AnimalCard
              key={img.id}
              image={img}
              onMoreLikeThis={handleMoreLikeThis}
              style={cardStyle(i)}
            />
          ))}
        </div>

        <div className="load-sentinel" ref={sentinelRef}>
          {loading && <div className="spinner" role="status" aria-label="Loading more animals" />}
        </div>
      </div>
    </>
  );
}
