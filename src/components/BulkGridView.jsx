import React, { useState, useMemo } from 'react';
import { CheckSquare, Square, Trash2, Heart, Filter, Sparkles, AlertCircle, Play } from 'lucide-react';
import { formatBytes } from '../utils/mediaParser';

export function BulkGridView({
  items,
  onBulkMoveToTrash,
  onBulkKeep,
  onOpenInfo
}) {
  const [filter, setFilter] = useState('all'); // 'all', 'memes', 'videos', 'animated', 'trash'
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Filter items based on active tab
  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'memes':
        return items.filter(item => item.isGoodMorningMeme && item.status !== 'trash');
      case 'videos':
        return items.filter(item => item.isLargeVideo && item.status !== 'trash');
      case 'animated':
        return items.filter(item => item.isAnimated && item.status !== 'trash');
      case 'trash':
        return items.filter(item => item.status === 'trash');
      default:
        return items.filter(item => item.status !== 'trash');
    }
  }, [items, filter]);

  // Handle select toggle
  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleBulkTrashClick = () => {
    const selectedItems = items.filter(item => selectedIds.has(item.id));
    onBulkMoveToTrash(selectedItems);
    setSelectedIds(new Set());
  };

  const handleBulkKeepClick = () => {
    const selectedItems = items.filter(item => selectedIds.has(item.id));
    onBulkKeep(selectedItems);
    setSelectedIds(new Set());
  };

  const selectedTotalBytes = useMemo(() => {
    return items
      .filter(item => selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.size, 0);
  }, [items, selectedIds]);

  return (
    <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
      {/* Filter Chips Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: filter === 'all' ? '1px solid #FF8E53' : '1px solid rgba(255,255,255,0.1)',
            background: filter === 'all' ? 'rgba(255, 142, 83, 0.2)' : 'rgba(255,255,255,0.05)',
            color: filter === 'all' ? '#FF8E53' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          All ({items.filter(i => i.status !== 'trash').length})
        </button>

        <button
          onClick={() => setFilter('memes')}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: filter === 'memes' ? '1px solid #FF8E53' : '1px solid rgba(255,255,255,0.1)',
            background: filter === 'memes' ? 'rgba(255, 142, 83, 0.2)' : 'rgba(255,255,255,0.05)',
            color: filter === 'memes' ? '#FF8E53' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🌅 Good Morning Memes</span>
        </button>

        <button
          onClick={() => setFilter('videos')}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: filter === 'videos' ? '1px solid #60A5FA' : '1px solid rgba(255,255,255,0.1)',
            background: filter === 'videos' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
            color: filter === 'videos' ? '#60A5FA' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          🎥 Large Videos
        </button>

        <button
          onClick={() => setFilter('animated')}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: filter === 'animated' ? '1px solid #C084FC' : '1px solid rgba(255,255,255,0.1)',
            background: filter === 'animated' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)',
            color: filter === 'animated' ? '#C084FC' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          👾 GIFs
        </button>
      </div>

      {/* Bulk Controls Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.04)',
          padding: '10px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <button
          onClick={handleSelectAll}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {selectedIds.size > 0 && selectedIds.size === filteredItems.length ? (
            <CheckSquare size={18} color="var(--accent-keep)" />
          ) : (
            <Square size={18} color="var(--text-muted)" />
          )}
          <span>Select All ({filteredItems.length})</span>
        </button>

        {selectedIds.size > 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-keep)', fontWeight: 700 }}>
            {selectedIds.size} Selected ({formatBytes(selectedTotalBytes)})
          </span>
        )}
      </div>

      {/* Floating Action Bar when items selected */}
      {selectedIds.size > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            background: 'rgba(18, 20, 29, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 16px',
            borderRadius: '16px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}
        >
          <button
            onClick={handleBulkTrashClick}
            style={{
              flex: 1,
              background: '#FF3B30',
              color: '#FFF',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={16} />
            <span>Trash ({selectedIds.size})</span>
          </button>

          <button
            onClick={handleBulkKeepClick}
            style={{
              flex: 1,
              background: '#10B981',
              color: '#FFF',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Heart size={16} fill="#FFF" />
            <span>Keep ({selectedIds.size})</span>
          </button>
        </div>
      )}

      {/* Grid of items */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
          <p>No items found for this filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {filteredItems.map(item => {
            const isSelected = selectedIds.has(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#000',
                  border: isSelected ? '3px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Selection Overlay Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: isSelected ? '#10B981' : 'rgba(0,0,0,0.5)',
                    color: '#FFF',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                </div>

                {/* Bottom Tag Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    inset: 'auto 0 0 0',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFF' }}>
                    {item.formattedSize}
                  </span>
                  {item.isGoodMorningMeme && (
                    <span style={{ fontSize: '0.65rem', color: '#FF8E53', fontWeight: 600 }}>
                      🌅 Good Morning Meme
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
