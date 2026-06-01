import { useState, useMemo } from 'react';
import { ANIMAL_REGISTRY } from '../data/animalRegistry';
import type { AnimalEntry } from '../data/animalRegistry';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo((): AnimalEntry[] => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return ANIMAL_REGISTRY.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.tags.some((t) => t.includes(q)) ||
        e.facts.some((f) => f.toLowerCase().includes(q)),
    ).slice(0, 8);
  }, [query]);

  function open() { setIsOpen(true); }
  function close() { setIsOpen(false); setQuery(''); }

  return { query, setQuery, isOpen, open, close, suggestions };
}
