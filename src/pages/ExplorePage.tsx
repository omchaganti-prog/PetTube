import React, { useMemo } from 'react';
import { ExploreCard } from '../components/ExploreCard';
import { ANIMAL_REGISTRY, GROUP_LABELS, GROUP_ORDER, seededRandom } from '../data/animalRegistry';
import { generateSingleAnimal } from '../utils/imageUtils';
import type { AnimalImage } from '../types';

// Deterministically generate 8 animals per section (seeded so they're stable on re-render)
function sectionAnimals(ids: string[], count = 8): AnimalImage[] {
  const sorted = [...ids].sort((a, b) => seededRandom(a + 'order') - seededRandom(b + 'order'));
  const picked = sorted.slice(0, count);
  return picked.map((id) => generateSingleAnimal(id));
}

function trendingAnimals(): AnimalImage[] {
  // Trending = highest seeded score animals across all categories
  const scored = ANIMAL_REGISTRY.map((e) => ({
    entry: e,
    score: seededRandom(e.id + 'trending'),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 10).map((s) => generateSingleAnimal(s.entry.id));
}

export function ExplorePage() {
  const trending = useMemo(trendingAnimals, []);

  const sections = useMemo(
    () =>
      GROUP_ORDER.filter((g) => g !== 'baby').map((group) => {
        const entries = ANIMAL_REGISTRY.filter((e) => e.group === group);
        const ids = entries.map((e) => e.id);
        return {
          group,
          label: GROUP_LABELS[group] ?? group,
          animals: sectionAnimals(ids, 8),
        };
      }),
    [],
  );

  const babyAnimals = useMemo(
    () => sectionAnimals(ANIMAL_REGISTRY.filter((e) => e.group === 'baby').map((e) => e.id), 8),
    [],
  );

  return (
    <main className="explore-page">
      <h1 className="explore-heading">🗺️ Explore Animals</h1>

      {/* Trending */}
      <section className="explore-section">
        <h2 className="explore-section-title">🔥 Trending Right Now</h2>
        <div className="explore-row">
          {trending.map((a) => (
            <ExploreCard key={a.id} animal={a} />
          ))}
        </div>
      </section>

      {/* Per-group sections */}
      {sections.map(({ group, label, animals }) => (
        <section key={group} className="explore-section">
          <h2 className="explore-section-title">{label}</h2>
          <div className="explore-row">
            {animals.map((a) => (
              <ExploreCard key={a.id} animal={a} />
            ))}
          </div>
        </section>
      ))}

      {/* Baby animals */}
      {babyAnimals.length > 0 && (
        <section className="explore-section">
          <h2 className="explore-section-title">🐣 Baby Animals</h2>
          <div className="explore-row">
            {babyAnimals.map((a) => (
              <ExploreCard key={a.id} animal={a} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
