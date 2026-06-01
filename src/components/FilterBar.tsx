import React from 'react';
import type { FilterCategory } from '../types';
import { FILTER_LABELS, CATEGORIES } from '../constants';

interface Props {
  active: FilterCategory;
  onSelect: (f: FilterCategory) => void;
}

const ALL_FILTERS: FilterCategory[] = ['all', ...CATEGORIES];

export default function FilterBar({ active, onSelect }: Props) {
  return (
    <div className="filter-section">
      <div className="filter-bar" role="tablist" aria-label="Filter by animal">
        {ALL_FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={active === f}
            className={`filter-btn${active === f ? ' active' : ''}`}
            onClick={() => onSelect(f)}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>
    </div>
  );
}
