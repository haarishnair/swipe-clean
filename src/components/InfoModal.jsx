import React from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, Sparkles, FileText, HardDrive, Calendar, Image as ImageIcon } from 'lucide-react';
import { formatBytes } from '../utils/mediaParser';

export function InfoModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#FF8E53" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800 }}>
              Media Inspector
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#FFF',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Thumbnail */}
        <div
          style={{
            width: '100%',
            height: '160px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#000'
          }}
        >
          <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Metadata Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} /> Name:
            </span>
            <span style={{ fontWeight: 600, color: '#FFF', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.name}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HardDrive size={14} /> Size:
            </span>
            <span style={{ fontWeight: 700, color: '#FF8E53' }}>{item.formattedSize}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ImageIcon size={14} /> Dimensions:
            </span>
            <span style={{ fontWeight: 600 }}>{item.dimensions}</span>
          </div>
        </div>

        {/* AI Smart Detection Results Box */}
        <div
          style={{
            background: item.isGoodMorningMeme ? 'rgba(255, 142, 83, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: item.isGoodMorningMeme ? '1px solid rgba(255, 142, 83, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '14px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: item.isGoodMorningMeme ? '#FF8E53' : '#10B981' }}>
            <ShieldCheck size={16} />
            <span>AI Smart Detection Analysis</span>
          </div>
          {item.isGoodMorningMeme ? (
            <>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Flagged as <strong>Good Morning / Greeting Meme</strong> based on canvas text saturation and quote keywords.
              </p>
              {item.detectedText && (
                <div style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '6px', fontStyle: 'italic', color: '#FFF' }}>
                  "{item.detectedText}"
                </div>
              )}
            </>
          ) : (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Standard personal photo or video. No clutter graphics detected.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
