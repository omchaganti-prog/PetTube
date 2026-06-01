import { useState, useCallback, useEffect } from 'react';
import type { AnimalImage, AnimalCategory } from '../types';
import { generateSingleAnimal } from '../utils/imageUtils';
import { warmUpPool } from '../services/imagePool';

const REVEAL_MS = 700;   // mystery-card duration
const MAX_HISTORY = 30;  // animals kept in back-navigation history

export function useDiscovery() {
  const [current, setCurrent] = useState<AnimalImage | null>(null);
  const [history, setHistory] = useState<AnimalImage[]>([]);
  const [histPos, setHistPos] = useState(-1);
  const [revealing, setRevealing] = useState(false);
  const [poolReady, setPoolReady] = useState(false);

  // Warm up the image pool, then generate the first animal.
  useEffect(() => {
    let cancelled = false;
    const timeout = new Promise<void>((r) => setTimeout(r, 4000));
    Promise.race([warmUpPool(), timeout]).then(() => {
      if (cancelled) return;
      const first = generateSingleAnimal();
      setCurrent(first);
      setHistory([first]);
      setHistPos(0);
      setPoolReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  /**
   * Advance to the next animal.
   * - Without fixedCategory: navigates forward in history when available,
   *   otherwise generates a fresh random animal.
   * - With fixedCategory: always generates a new animal of that species
   *   (used by "More Like This").
   */
  const nextAnimal = useCallback(
    (fixedCategory?: AnimalCategory) => {
      if (revealing) return;
      setRevealing(true);

      if (!fixedCategory && histPos < history.length - 1) {
        // Navigate forward in existing history
        const next = history[histPos + 1];
        setTimeout(() => {
          setCurrent(next);
          setHistPos((p) => p + 1);
          setRevealing(false);
        }, REVEAL_MS);
      } else {
        // Generate a brand-new animal
        const next = generateSingleAnimal(fixedCategory);
        const trimmed = history.slice(-(MAX_HISTORY - 1));
        const newHistory = [...trimmed, next];
        const newPos = newHistory.length - 1;
        setTimeout(() => {
          setHistory(newHistory);
          setCurrent(next);
          setHistPos(newPos);
          setRevealing(false);
        }, REVEAL_MS);
      }
    },
    [revealing, histPos, history],
  );

  /** Go back to the previous animal in history. */
  const prevAnimal = useCallback(() => {
    if (revealing || histPos <= 0) return;
    setRevealing(true);
    const prev = history[histPos - 1];
    setTimeout(() => {
      setCurrent(prev);
      setHistPos((p) => p - 1);
      setRevealing(false);
    }, REVEAL_MS);
  }, [revealing, histPos, history]);

  return {
    current,
    revealing,
    poolReady,
    nextAnimal,
    prevAnimal,
    canGoBack: histPos > 0,
    histPos,
    historyLength: history.length,
  };
}
