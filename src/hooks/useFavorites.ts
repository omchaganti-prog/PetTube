import { useState, useEffect, useCallback } from 'react';
import type { FavoriteItem, AnimalImage } from '../types';
import { LS_FAVORITES_KEY, CONFETTI_MILESTONE } from '../constants';
import confetti from 'canvas-confetti';

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(LS_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favs: FavoriteItem[]): void {
  localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(favs));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const addFavorite = useCallback((image: AnimalImage) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === image.id)) return prev;
      const next = [{ ...image, savedAt: Date.now() }, ...prev];
      // Confetti at milestone
      if (next.length === CONFETTI_MILESTONE) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff6b9d', '#ff9a9e', '#fecfef', '#ffd700', '#ff8c00'],
        });
      }
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (image: AnimalImage) => {
      if (favorites.find((f) => f.id === image.id)) {
        removeFavorite(image.id);
      } else {
        addFavorite(image);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    toggleFavorite,
    count: favorites.length,
  };
}
