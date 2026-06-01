import React, { useState, useEffect, useRef } from 'react';
import type { AnimalImage } from '../types';
import { useFavCtx, useNotifCtx } from '../context/AppContext';
import { downloadImage, shareImage } from '../utils/imageUtils';
import { getFallbackUrl } from '../services/imagePool';

interface Props {
  image: AnimalImage;
  onMoreLikeThis: (image: AnimalImage) => void;
  style?: React.CSSProperties;
}

/** After this many ms without a load event, swap to the next fallback URL */
const LOAD_TIMEOUT_MS = 7000;
const MAX_RETRIES = 5;

export default function AnimalCard({ image, onMoreLikeThis, style }: Props) {
  const { isFavorite, toggleFavorite } = useFavCtx();
  const { showNotification } = useNotifCtx();
  const [imgSrc, setImgSrc] = useState(image.url);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function swapToFallback() {
    if (retryRef.current >= MAX_RETRIES) return; // keep skeleton, never show broken icon
    retryRef.current += 1;
    setImgLoaded(false);
    setImgSrc(getFallbackUrl(image.category));
  }

  // Reset when image.url changes (card recycled for a different photo)
  useEffect(() => {
    setImgSrc(image.url);
    setImgLoaded(false);
    retryRef.current = 0;
  }, [image.url]);

  // Timeout fallback: if the image hasn't loaded after LOAD_TIMEOUT_MS, swap URL
  useEffect(() => {
    if (imgLoaded) return;
    timerRef.current = setTimeout(swapToFallback, LOAD_TIMEOUT_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgSrc, imgLoaded]);

  function handleImgLoad() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setImgLoaded(true);
  }

  function handleImgError() {
    if (timerRef.current) clearTimeout(timerRef.current);
    swapToFallback();
  }

  const fav = isFavorite(image.id);

  function handleFav() {
    toggleFavorite(image);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    if (!fav) showNotification(`Saved ${image.title} to favorites! ❤️`, 'success');
  }

  function handleShare() {
    shareImage(imgSrc, image.title);
    showNotification('Link copied! Share the cuteness 🐾', 'info');
  }

  function handleDownload() {
    downloadImage(imgSrc, `${image.title.replace(/\s+/g, '-')}.jpg`);
    showNotification('Downloading image 📥', 'info');
  }

  return (
    <article className="animal-card" style={style}>
      <div className="card-image-wrap">
        {/* Blurred background — fills space around the fully-visible animal */}
        <img src={imgSrc} aria-hidden="true" className="img-blur-bg" alt="" />
        {!imgLoaded && <div className="img-skeleton" />}
        <img
          src={imgSrc}
          alt={image.title}
          className="img-main"
          onLoad={handleImgLoad}
          onError={handleImgError}
          style={{ opacity: imgLoaded ? 1 : 0, display: 'block' }}
        />
        <div className="card-category-badge">{image.title}</div>
        <div className="card-img-overlay" />
        <button
          className="card-more-btn"
          onClick={() => onMoreLikeThis(image)}
          aria-label={`Show more like ${image.title}`}
        >
          🔍 More Like This
        </button>
      </div>

      <div className="card-body">
        <div className="card-title">{image.title}</div>
        {image.fact && <div className="card-fact">💡 {image.fact}</div>}
        <div className="card-actions">
          <button
            className="card-action-btn"
            onClick={handleShare}
            title="Share"
            aria-label="Share image"
          >
            📤
          </button>
          <button
            className="card-action-btn"
            onClick={handleDownload}
            title="Download"
            aria-label="Download image"
          >
            ⬇️
          </button>
          <button
            className={`card-action-btn fav-btn${fav ? ' active' : ''}${heartAnim ? ' heart-pop' : ''}`}
            onClick={handleFav}
            title={fav ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={fav}
          >
            {fav ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </article>
  );
}
