import React from 'react';
import { ANIMAL_FACTS } from '../constants';

const fact = ANIMAL_FACTS[Math.floor(Math.random() * ANIMAL_FACTS.length)];

export default function FactTicker() {
  return (
    <div className="fact-ticker" aria-label="Animal fact of the moment">
      <span className="fact-ticker__inner">
        🐾 Did you know? {fact} &nbsp;&nbsp;&nbsp; 🐾 Did you know? {fact}
      </span>
    </div>
  );
}
