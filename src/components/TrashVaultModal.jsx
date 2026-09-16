import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Download, Smartphone, Sparkles, RefreshCw, ShieldCheck, History } from 'lucide-react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { formatBytes } from '../utils/mediaParser';
import { downloadReportAsFile } from '../utils/shortcutGenerator';

export function TrashVaultModal({
  isOpen,
  onClose,
  trashItems,
  keptItems,
  clearedHistory = [],
  onRestoreItem,
  onEmptyTrash
}) {
  const [activeTab, setActiveTab] = useState('staged'); // 'staged' | 'history'

  if (!isOpen) return null;

  const totalBytesSaved = trashItems.reduce((sum, item) => sum + item.size, 0);

  const handleEmptyTrashClick = () => {
    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onEmptyTrash();
  };

  const handleExportZipKept = async () => {
    const zip = new JSZip();
    const folder = zip.folder("SwipeClean_Kept_Media");

    for (let item of keptItems) {
      if (item.fileObject) {
        folder.file(item.name, item.fileObject);
      } else {
        // Fetch remote URL blob if sample item
        try {
          const res = await fetch(item.url);
          const blob = await res.blob();
          folder.file(item.name, blob);
        } catch (e) {
          console.warn("Could not add item to zip:", item.name);
        }
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SwipeClean_Kept_Media_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(16px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            background: 'var(--bg-card)',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                🗑️ Trash & Recovery Vault
              </h2>
              <p style={{ color: 'var(--accent-trash)', fontSize: '0.82rem', fontWeight: 700, marginTop: '2px' }}>
                Staged Space: {formatBytes(totalBytesSaved)} ({trashItems.length} items)
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#FFF',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Sub-tabs: Staged for Trash vs Recently Deleted History */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '6px 16px',
              gap: '12px'
            }}
          >
            <button
              onClick={() => setActiveTab('staged')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'staged' ? 'rgba(255,59,48,0.2)' : 'transparent',
                color: activeTab === 'staged' ? '#FF3B30' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Trash2 size={14} />
              <span>Staged Trash ({trashItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'history' ? 'rgba(16,185,129,0.2)' : 'transparent',
                color: activeTab === 'history' ? '#10B981' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <History size={14} />
              <span>Recently Deleted Log ({clearedHistory.length})</span>
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeTab === 'staged' ? (
              trashItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                  <Trash2 size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600 }}>Your Trash Vault is currently empty!</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Swipe left on photos to stage them here for deletion.</p>
                </div>
              ) : (
                trashItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      padding: '10px 12px',
                      borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {item.formattedSize} • {item.isGoodMorningMeme ? '🌅 Meme' : item.type}
                      </div>
                    </div>

                    <button
                      onClick={() => onRestoreItem(item)}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid #10B981',
                        color: '#10B981',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Restore item to deck"
                    >
                      <RefreshCw size={12} />
                      <span>Restore</span>
                    </button>
                  </div>
                ))
              )
            ) : (
              /* History Tab */
              clearedHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                  <History size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600 }}>No cleared history yet.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Items emptied from the vault will appear here for session recovery.</p>
                </div>
              ) : (
                clearedHistory.map(item => (
                  <div
                    key={'hist-' + item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      padding: '10px 12px',
                      borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', opacity: 0.7 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '2px', fontWeight: 600 }}>
                        Cleared from Session ({item.formattedSize})
                      </div>
                    </div>

                    <button
                      onClick={() => onRestoreItem(item)}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid #10B981',
                        color: '#10B981',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RefreshCw size={12} />
                      <span>Undo / Recover</span>
                    </button>
                  </div>
                ))
              )
            )}

            {/* iOS Apple Photos Safety Notice Card */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '14px',
                borderRadius: '16px',
                marginTop: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px' }}>
                <ShieldCheck size={18} />
                <span>Apple iOS 30-Day "Recently Deleted" Safety Net</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                When photos or videos are deleted inside Apple's native iOS Photos app, Apple moves them into the <strong>"Recently Deleted" album for 30 days</strong>. You can open iOS Photos → Albums → Recently Deleted → Recover anytime to restore them!
              </p>
            </div>

            {/* iOS Helper Action Card */}
            {trashItems.length > 0 && activeTab === 'staged' && (
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '14px',
                  borderRadius: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>
                  <Smartphone size={18} />
                  <span>iPhone Photo Library Deletion Helper</span>
                </div>
                <button
                  onClick={() => downloadReportAsFile(trashItems)}
                  style={{
                    width: '100%',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid #60A5FA',
                    color: '#60A5FA',
                    padding: '8px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} />
                  <span>Download iOS Deletion Report (.txt)</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {trashItems.length > 0 && activeTab === 'staged' && (
            <div
              style={{
                padding: '16px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                gap: '12px'
              }}
            >
              {keptItems.length > 0 && (
                <button
                  onClick={handleExportZipKept}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#FFF',
                    padding: '12px',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={16} />
                  <span>Zip Kept ({keptItems.length})</span>
                </button>
              )}

              <button
                onClick={handleEmptyTrashClick}
                style={{
                  flex: 1.5,
                  background: '#FF3B30',
                  border: 'none',
                  color: '#FFF',
                  padding: '12px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(255, 59, 48, 0.4)'
                }}
              >
                <Sparkles size={16} />
                <span>Empty Vault & Celebrate 🎉</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
