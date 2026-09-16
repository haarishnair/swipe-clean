import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trash2, Heart, Info, Sparkles, Play, Volume2, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatBytes } from '../utils/mediaParser';

export function SwipeCardStack({
  items,
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
  onUndo,
  onOpenInfo,
  onAutoCleanMemes,
  canUndo
}) {
  const currentItem = items[currentIndex];
  const nextItem = items[currentIndex + 1];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const stampKeepOpacity = useTransform(x, [20, 100], [0, 1]);
  const stampTrashOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      onSwipeRight(currentItem);
    } else if (offset < -100 || velocity < -500) {
      onSwipeLeft(currentItem);
    }
  };

  if (!currentItem || currentIndex >= items.length) {
    return (
      <div className="swipe-stage">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: 'center',
            padding: '40px 24px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '340px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#10B981'
            }}
          >
            <Sparkles size={32} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
            All Cleaned Up! 🎉
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
            You've swiped through all items in this set. Check your Trash Vault to finalize deletion and claim your space.
          </p>
          {canUndo && (
            <button
              onClick={onUndo}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFF',
                padding: '10px 20px',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RotateCcw size={16} />
              <span>Undo Last Swipe</span>
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="swipe-stage">
      {/* Auto Meme Clean Notice if meme detected */}
      {currentItem.isGoodMorningMeme && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: '8px',
            background: 'rgba(255, 142, 83, 0.15)',
            border: '1px solid rgba(255, 142, 83, 0.35)',
            color: '#FF8E53',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 30,
            backdropFilter: 'blur(8px)'
          }}
        >
          <AlertCircle size={14} />
          <span>Smart Detector: "Good Morning" Meme / Greeting</span>
        </motion.div>
      )}

      <div className="card-container">
        {/* Next Card Preview Underneath */}
        {nextItem && (
          <div
            className="swipe-card"
            style={{
              transform: 'scale(0.94) translateY(16px)',
              opacity: 0.6,
              pointerEvents: 'none'
            }}
          >
            <div className="card-media-wrapper">
              {nextItem.type === 'video' ? (
                <img src={nextItem.url} alt={nextItem.name} className="card-media" />
              ) : (
                <img src={nextItem.url} alt={nextItem.name} className="card-media" />
              )}
            </div>
          </div>
        )}

        {/* Current Active Swipable Card */}
        <motion.div
          className="swipe-card"
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
        >
          {/* Stamps */}
          <motion.div className="swipe-stamp stamp-keep" style={{ opacity: stampKeepOpacity }}>
            KEEP
          </motion.div>
          <motion.div className="swipe-stamp stamp-trash" style={{ opacity: stampTrashOpacity }}>
            TRASH
          </motion.div>

          {/* Media Content */}
          <div className="card-media-wrapper">
            {currentItem.type === 'video' ? (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <video
                  src={currentItem.videoUrl || currentItem.url}
                  poster={currentItem.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="card-media"
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFF',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Play size={12} fill="#FFF" />
                  <span>{currentItem.duration || 'VIDEO'}</span>
                </div>
              </div>
            ) : (
              <img
                src={currentItem.url}
                alt={currentItem.name}
                className="card-media"
                loading="eager"
              />
            )}
            <div className="card-gradient-overlay" />
          </div>

          {/* Bottom Card Information */}
          <div className="card-info-box">
            <div className="card-tags">
              <span className="tag-chip tag-size">{currentItem.formattedSize}</span>
              {currentItem.isGoodMorningMeme && <span className="tag-chip tag-meme">🌅 Meme / Greeting</span>}
              {currentItem.isLargeVideo && <span className="tag-chip tag-video">🎥 Large Video</span>}
              {currentItem.isAnimated && <span className="tag-chip tag-animated">👾 Animated GIF</span>}
            </div>
            <h3 className="card-title">{currentItem.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', gap: '12px' }}>
              <span>Dimensions: {currentItem.dimensions}</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Touch / Click Controls Bar */}
      <div className="controls-bar">
        {/* Undo */}
        <button
          className="btn-circle btn-undo"
          onClick={onUndo}
          disabled={!canUndo}
          style={{ opacity: canUndo ? 1 : 0.4 }}
          title="Undo last action"
        >
          <RotateCcw size={22} />
        </button>

        {/* Trash Swipe Left */}
        <button
          className="btn-circle btn-trash"
          onClick={() => onSwipeLeft(currentItem)}
          title="Swipe Left: Move to Trash"
        >
          <Trash2 size={30} />
        </button>

        {/* Keep Swipe Right */}
        <button
          className="btn-circle btn-keep"
          onClick={() => onSwipeRight(currentItem)}
          title="Swipe Right: Keep Photo"
        >
          <Heart size={30} fill="currentColor" />
        </button>

        {/* Details / AI Inspector */}
        <button
          className="btn-circle btn-info"
          onClick={() => onOpenInfo(currentItem)}
          title="Inspect Details & Detection"
        >
          <Info size={22} />
        </button>
      </div>
    </div>
  );
}
