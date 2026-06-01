import { useState, useCallback, useRef, useEffect } from 'react';
import type { AnimalImage, AnimalCategory, FilterCategory } from '../types';
import {
  generateImagesForCategory,
  generateMixedImages,
  generateSurpriseImages,
} from '../utils/imageUtils';
import { warmUpPool } from '../services/imagePool';
import { PAGE_SIZE } from '../constants';

export function useFeed() {
  // Start empty — filled after pool warms up so images come from Wikipedia/API, not loremflickr
  const [images, setImages] = useState<AnimalImage[]>([]);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [loading, setLoading] = useState(true); // true until pool is ready
  const [surpriseMode, setSurpriseMode] = useState(false);
  const offsetRef = useRef(PAGE_SIZE);
  const filterRef = useRef<FilterCategory>('all');

  // On mount: warm up the pool (race with 4-second safety timeout),
  // then generate the initial batch so it uses Wikipedia / API images.
  useEffect(() => {
    let cancelled = false;
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 4000));

    Promise.race([warmUpPool(), timeout]).then(() => {
      if (cancelled) return;
      setImages(generateMixedImages(PAGE_SIZE, 0));
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const applyFilter = useCallback((newFilter: FilterCategory) => {
    filterRef.current = newFilter;
    setFilter(newFilter);
    setSurpriseMode(false);
    offsetRef.current = PAGE_SIZE;
    if (newFilter === 'all') {
      setImages(generateMixedImages(PAGE_SIZE, 0));
    } else {
      setImages(generateImagesForCategory(newFilter as AnimalCategory, PAGE_SIZE, 0));
    }
  }, []);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    const offset = offsetRef.current;
    const currentFilter = filterRef.current;
    setTimeout(() => {
      let next: AnimalImage[];
      if (surpriseMode) {
        next = generateSurpriseImages(PAGE_SIZE);
      } else if (currentFilter === 'all') {
        next = generateMixedImages(PAGE_SIZE, offset);
      } else {
        next = generateImagesForCategory(currentFilter as AnimalCategory, PAGE_SIZE, offset);
      }
      setImages((prev) => [...prev, ...next]);
      offsetRef.current = offset + PAGE_SIZE;
      setLoading(false);
    }, 400);
  }, [loading, surpriseMode]);

  const activateSurprise = useCallback(() => {
    setSurpriseMode(true);
    filterRef.current = 'all';
    setFilter('all');
    offsetRef.current = PAGE_SIZE;
    setImages(generateSurpriseImages(PAGE_SIZE));
  }, []);

  const filterByCategory = useCallback(
    (category: AnimalCategory) => {
      applyFilter(category);
    },
    [applyFilter]
  );

  return {
    images,
    filter,
    loading,
    surpriseMode,
    applyFilter,
    loadMore,
    activateSurprise,
    filterByCategory,
  };
}
