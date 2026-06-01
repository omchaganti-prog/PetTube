import React, { useState, useEffect } from 'react';

const EMOJIS = ['🐶', '🐱', '🐰', '🐹', '🦆', '🦜', '🦊', '🐼', '🦝', '🐾'];

export default function LoadingScreen() {
  const [emoji, setEmoji] = useState(EMOJIS[0]);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % EMOJIS.length;
      setEmoji(EMOJIS[i]);
    }, 200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-screen__emoji">{emoji}</div>
      <div className="loading-screen__text">PetTube 🐾</div>
      <div className="loading-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}
