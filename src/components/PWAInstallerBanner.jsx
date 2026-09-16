import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Smartphone } from 'lucide-react';

export function PWAInstallerBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Detect iOS browser
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isStandalone) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(255, 142, 83, 0.15))',
        borderBottom: '1px solid rgba(255, 142, 83, 0.3)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: '#F8FAFC',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Smartphone size={16} color="#FF8E53" />
        <span>
          Install on iPhone: Tap <strong>Share <Share size={12} style={{ display: 'inline' }} /></strong> then <strong>'Add to Home Screen' <PlusSquare size={12} style={{ display: 'inline' }} /></strong>
        </span>
      </div>
      <button
        onClick={() => setShowBanner(false)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
