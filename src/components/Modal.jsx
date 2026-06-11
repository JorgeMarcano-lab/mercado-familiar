import React, { useEffect } from 'react';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={sheet}>
        <div style={handle} />
        {title && (
          <div style={hdr}>
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{title}</span>
            <button onClick={onClose} style={{ color: 'var(--text2)', fontSize: 22, lineHeight: 1, padding: '0 4px' }}>×</button>
          </div>
        )}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 80px)', paddingBottom: 'var(--safe-bottom)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0, zIndex: 100,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'flex-end',
  animation: 'fadeIn 0.15s ease',
};
const sheet = {
  width: '100%', maxWidth: 480, margin: '0 auto',
  background: 'var(--bg)',
  borderRadius: '16px 16px 0 0',
  paddingTop: 8,
  animation: 'slideUp 0.2s ease',
  maxHeight: '90vh',
};
const handle = {
  width: 36, height: 4, borderRadius: 2,
  background: 'var(--border2)', margin: '0 auto 8px',
};
const hdr = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '8px 16px 12px',
  borderBottom: '0.5px solid var(--border)',
};
