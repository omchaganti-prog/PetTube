import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavCtx, useNotifCtx } from '../context/AppContext';
import AnimalCard from '../components/AnimalCard';
import type { AnimalImage } from '../types';

export default function FavoritesPage() {
  const { favorites, clearFavorites, count } = useFavCtx();
  const { showNotification } = useNotifCtx();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return favorites;
    return favorites.filter(
      (f) => f.title.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
  }, [favorites, search]);

  function handleClearAll() {
    if (window.confirm('Clear all favorites? This cannot be undone.')) {
      clearFavorites();
      showNotification('All favorites cleared 🗑️', 'warning');
    }
  }

  // Favorites page doesn't need moreLikeThis navigation to feed
  function handleMoreLikeThis(image: AnimalImage) {
    navigate(`/?filter=${image.category}`);
  }

  if (count === 0) {
    return (
      <div className="favorites-page">
        <div className="empty-state">
          <div className="empty-state__icon">❤️</div>
          <div className="empty-state__title">No favorites yet</div>
          <div className="empty-state__sub">
            Start saving adorable animals and they'll appear here!
          </div>
          <button className="browse-btn" onClick={() => navigate('/')}>
            🐾 Browse Animals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>❤️ Favorites ({count})</h1>
        <input
          type="search"
          className="search-input"
          placeholder="🔍 Search favorites..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search favorites"
        />
        <button className="clear-all-btn" onClick={handleClearAll} aria-label="Clear all favorites">
          🗑️ Clear All
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <div className="empty-state__title">No results for "{search}"</div>
          <button className="browse-btn" onClick={() => setSearch('')}>
            Clear Search
          </button>
        </div>
      ) : (
        <div className="image-grid">
          {filtered.map((img, i) => (
            <AnimalCard
              key={img.id}
              image={img}
              onMoreLikeThis={handleMoreLikeThis}
              style={{ animationDelay: `${i * 0.04}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
