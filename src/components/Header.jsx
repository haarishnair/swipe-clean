import React from 'react';
import { Flame, Trash2, Upload, Sparkles, Layers, Grid } from 'lucide-react';
import { formatBytes } from '../utils/mediaParser';

export function Header({
  viewMode,
  setViewMode,
  savedBytes,
  trashCount,
  onOpenTrash,
  onImportClick,
  onAutoScanMemes
}) {
  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="brand-badge">
          <Flame size={22} style={{ color: '#FF6B6B' }} />
          <span>SwipeClean</span>
        </div>
        
        {savedBytes > 0 && (
          <div className="stats-pill">
            <Sparkles size={14} />
            <span>Saved {formatBytes(savedBytes)}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Mode Switcher */}
        <div className="view-tabs">
          <button
            className={`tab-btn ${viewMode === 'swipe' ? 'active' : ''}`}
            onClick={() => setViewMode('swipe')}
            title="Bumble Swipe Mode"
          >
            <Layers size={15} />
            <span>Swipe</span>
          </button>
          <button
            className={`tab-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Bulk Grid Filter"
          >
            <Grid size={15} />
            <span>Bulk</span>
          </button>
        </div>

        {/* Import Files Button */}
        <button
          onClick={onImportClick}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#F8FAFC',
            borderRadius: '10px',
            padding: '7px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
          title="Upload Photos or Videos"
        >
          <Upload size={14} />
        </button>

        {/* Trash Vault Button */}
        <button
          onClick={onOpenTrash}
          style={{
            background: trashCount > 0 ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 255, 255, 0.08)',
            border: trashCount > 0 ? '1px solid #FF3B30' : '1px solid rgba(255, 255, 255, 0.15)',
            color: trashCount > 0 ? '#FF3B30' : '#F8FAFC',
            borderRadius: '10px',
            padding: '7px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            position: 'relative'
          }}
          title="Open Trash Vault"
        >
          <Trash2 size={16} />
          {trashCount > 0 && <span>{trashCount}</span>}
        </button>
      </div>
    </header>
  );
}
