'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface DetailBannerProps {
  images: string[];
  plantName?: string;
}

const SWIPE_THRESHOLD = 50;
const AUTO_PLAY_MS = 4000;

/**
 * 植物详情页 Banner 图轮播
 * - 完整显示：banner 高度自适应图片，object-fit: contain
 * - 多图：左右切换 + 触摸滑动 + 指示点 + 自动播放
 * - 单图：退化为纯展示
 * - 点击放大：全屏 lightbox overlay，支持滑动切换 + ESC 关闭
 */
export default function DetailBanner({ images, plantName }: DetailBannerProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const lbTouchStartX = useRef<number | null>(null);
  const lbTouchDeltaX = useRef(0);

  const count = images.length;
  const isMulti = count > 1;

  // 自动播放
  useEffect(() => {
    if (!isMulti || lightboxOpen) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [isMulti, count, lightboxOpen]);

  // ESC 关闭 lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i - 1 + count) % count);
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i + 1) % count);
    };
    // 锁 body 滚动
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, count]);

  const goPrev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);
  const goNext = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  // 主 banner 触摸滑动
  const onMainTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onMainTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onMainTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) >= SWIPE_THRESHOLD) {
      if (touchDeltaX.current > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // Lightbox 触摸滑动
  const onLBTouchStart = (e: React.TouchEvent) => {
    lbTouchStartX.current = e.touches[0].clientX;
    lbTouchDeltaX.current = 0;
  };
  const onLBTouchMove = (e: React.TouchEvent) => {
    if (lbTouchStartX.current === null) return;
    lbTouchDeltaX.current = e.touches[0].clientX - lbTouchStartX.current;
  };
  const onLBTouchEnd = () => {
    if (Math.abs(lbTouchDeltaX.current) >= SWIPE_THRESHOLD) {
      if (lbTouchDeltaX.current > 0) setLightboxIdx((i) => (i - 1 + count) % count);
      else setLightboxIdx((i) => (i + 1) % count);
    }
    lbTouchStartX.current = null;
    lbTouchDeltaX.current = 0;
  };

  if (count === 0 || !images[0]) {
    return (
      <div className="detail-banner">
        <div className="detail-banner-placeholder">
          <span className="detail-banner-icon">🖼️</span>
          <span className="detail-banner-text">{plantName || '植物'}大图 · 图片占位</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ==================== Banner 主图 ==================== */}
      <div
        className="detail-banner"
        onTouchStart={onMainTouchStart}
        onTouchMove={onMainTouchMove}
        onTouchEnd={onMainTouchEnd}
      >
        <div
          className="detail-banner-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="detail-banner-slide"
              role="button"
              tabIndex={0}
              onClick={() => openLightbox(i)}
              onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(i); }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`${plantName || ''} 图 ${i + 1}`}
                src={src}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {isMulti && (
          <>
            <button className="detail-banner-arrow detail-banner-prev" aria-label="上一张" onClick={goPrev}>‹</button>
            <button className="detail-banner-arrow detail-banner-next" aria-label="下一张" onClick={goNext}>›</button>
            <div className="detail-banner-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`detail-banner-dot${i === current ? ' active' : ''}`}
                  aria-label={`第 ${i + 1} 张`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
            <span className="detail-banner-count">{current + 1}/{count}</span>
          </>
        )}

        <span className="detail-banner-hint">点击放大</span>
      </div>

      {/* ==================== Lightbox 全屏放大 ==================== */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={onLBTouchStart}
          onTouchMove={onLBTouchMove}
          onTouchEnd={onLBTouchEnd}
        >
          <button className="lightbox-close" aria-label="关闭" onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}>✕</button>

          {isMulti && (
            <>
              <button
                className="lightbox-arrow lightbox-prev"
                aria-label="上一张"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i - 1 + count) % count); }}
              >‹</button>
              <button
                className="lightbox-arrow lightbox-next"
                aria-label="下一张"
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i + 1) % count); }}
              >›</button>
            </>
          )}

          <div
            className="lightbox-track"
            style={{ transform: `translateX(-${lightboxIdx * 100}%)` }}
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((src, i) => (
              <div key={i} className="lightbox-slide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${plantName || ''} 大图 ${i + 1}`}
                  src={src}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {isMulti && (
            <>
              <div className="lightbox-dots" onClick={(e) => e.stopPropagation()}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`lightbox-dot${i === lightboxIdx ? ' active' : ''}`}
                    aria-label={`第 ${i + 1} 张`}
                    onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                  />
                ))}
              </div>
              <span className="lightbox-count">{lightboxIdx + 1}/{count}</span>
            </>
          )}
        </div>
      )}
    </>
  );
}
