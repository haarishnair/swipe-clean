import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SwipeCardStack } from './components/SwipeCardStack';
import { BulkGridView } from './components/BulkGridView';
import { TrashVaultModal } from './components/TrashVaultModal';
import { InfoModal } from './components/InfoModal';
import { PWAInstallerBanner } from './components/PWAInstallerBanner';
import { generateDemoMedia, parseUserFile } from './utils/mediaParser';
import { analyzeMediaItem } from './utils/memeDetector';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState(generateDemoMedia);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [clearedHistory, setClearedHistory] = useState([]); // Tracks emptied items for session undo
  const [viewMode, setViewMode] = useState('swipe'); // 'swipe' | 'grid'
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [selectedInfoItem, setSelectedInfoItem] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef(null);

  // Handle Swipe Left (TRASH)
  const handleSwipeLeft = (item) => {
    const updated = items.map(i => (i.id === item.id ? { ...i, status: 'trash' } : i));
    setItems(updated);
    setHistory([...history, { item, action: 'trash', prevIndex: currentIndex }]);
    setCurrentIndex(prev => prev + 1);
  };

  // Handle Swipe Right (KEEP)
  const handleSwipeRight = (item) => {
    const updated = items.map(i => (i.id === item.id ? { ...i, status: 'keep' } : i));
    setItems(updated);
    setHistory([...history, { item, action: 'keep', prevIndex: currentIndex }]);
    setCurrentIndex(prev => prev + 1);
  };

  // Undo Last Action
  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const updated = items.map(i => (i.id === last.item.id ? { ...i, status: 'pending' } : i));
    setItems(updated);
    setHistory(history.slice(0, -1));
    setCurrentIndex(last.prevIndex);
  };

  // Bulk Move to Trash from Grid
  const handleBulkMoveToTrash = (selectedItems) => {
    const selectedIds = new Set(selectedItems.map(i => i.id));
    const updated = items.map(i => (selectedIds.has(i.id) ? { ...i, status: 'trash' } : i));
    setItems(updated);
  };

  // Bulk Keep from Grid
  const handleBulkKeep = (selectedItems) => {
    const selectedIds = new Set(selectedItems.map(i => i.id));
    const updated = items.map(i => (selectedIds.has(i.id) ? { ...i, status: 'keep' } : i));
    setItems(updated);
  };

  // Restore item from Trash Vault or Recently Deleted History
  const handleRestoreItem = (item) => {
    const isFromHistory = clearedHistory.some(h => h.id === item.id);

    if (isFromHistory) {
      setClearedHistory(clearedHistory.filter(h => h.id !== item.id));
      setItems([{ ...item, status: 'pending' }, ...items]);
    } else {
      const updated = items.map(i => (i.id === item.id ? { ...i, status: 'pending' } : i));
      setItems(updated);
    }
  };

  // Empty Trash Vault (moves items to Recently Deleted session history)
  const handleEmptyTrash = () => {
    const trashed = items.filter(i => i.status === 'trash');
    const remaining = items.filter(i => i.status !== 'trash');
    
    setClearedHistory([...trashed, ...clearedHistory]);
    setItems(remaining);
    setIsTrashOpen(false);

    if (currentIndex >= remaining.length) {
      setCurrentIndex(Math.max(0, remaining.length - 1));
    }
  };

  // Import User Files from Phone / Local Disk
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setIsAnalyzing(true);
    const parsedPromises = files.map(file => parseUserFile(file));
    const parsedItems = await Promise.all(parsedPromises);

    // Run Meme & Clutter Analysis on imported files
    const analyzedPromises = parsedItems.map(item => analyzeMediaItem(item));
    const analyzedItems = await Promise.all(analyzedPromises);

    // Sort all items largest to smallest
    const combined = [...analyzedItems, ...items].sort((a, b) => b.size - a.size);
    setItems(combined);
    setCurrentIndex(0);
    setIsAnalyzing(false);

    // Clear input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Auto-scan and auto-flag memes in current items
  const handleAutoScanMemes = async () => {
    setIsAnalyzing(true);
    const updatedPromises = items.map(item => analyzeMediaItem(item));
    const updated = await Promise.all(updatedPromises);
    setItems(updated);
    setIsAnalyzing(false);
  };

  // Calculate statistics
  const trashedItems = items.filter(i => i.status === 'trash');
  const keptItems = items.filter(i => i.status === 'keep');
  const savedBytes = trashedItems.reduce((sum, i) => sum + i.size, 0);

  return (
    <div className="app-container">
      {/* Hidden File Input for Native Media Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*,video/*"
        style={{ display: 'none' }}
      />

      <PWAInstallerBanner />

      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        savedBytes={savedBytes}
        trashCount={trashedItems.length}
        onOpenTrash={() => setIsTrashOpen(true)}
        onImportClick={() => fileInputRef.current?.click()}
        onAutoScanMemes={handleAutoScanMemes}
      />

      {/* Analyzing Overlay Indicator */}
      {isAnalyzing && (
        <div
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 142, 83, 0.2)',
            color: '#FF8E53',
            fontSize: '0.8rem',
            fontWeight: 700,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
          <span>AI Smart Detector analyzing image canvas & keywords...</span>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {viewMode === 'swipe' ? (
          <SwipeCardStack
            items={items}
            currentIndex={currentIndex}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onUndo={handleUndo}
            onOpenInfo={(item) => setSelectedInfoItem(item)}
            onAutoCleanMemes={handleAutoScanMemes}
            canUndo={history.length > 0}
          />
        ) : (
          <BulkGridView
            items={items}
            onBulkMoveToTrash={handleBulkMoveToTrash}
            onBulkKeep={handleBulkKeep}
            onOpenInfo={(item) => setSelectedInfoItem(item)}
          />
        )}
      </main>

      {/* Trash & Recently Deleted Vault Modal */}
      <TrashVaultModal
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        trashItems={trashedItems}
        keptItems={keptItems}
        clearedHistory={clearedHistory}
        onRestoreItem={handleRestoreItem}
        onEmptyTrash={handleEmptyTrash}
      />

      {/* Info Inspector Modal */}
      <InfoModal
        item={selectedInfoItem}
        onClose={() => setSelectedInfoItem(null)}
      />
    </div>
  );
}
