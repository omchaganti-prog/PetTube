import React from 'react';

const PAWS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  duration: `${12 + Math.random() * 10}s`,
  delay: `${Math.random() * 12}s`,
}));

export default function FloatingPaws() {
  return (
    <div className="paw-container" aria-hidden="true">
      {PAWS.map((p) => (
        <span
          key={p.id}
          className="paw"
          style={{
            '--left': p.left,
            '--duration': p.duration,
            '--delay': p.delay,
          } as React.CSSProperties}
        >
          🐾
        </span>
      ))}
    </div>
  );
}
