import React, { useState } from 'react';
import { Menu, X, Sparkles, Phone, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Header({ onOpenAdmin }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 9, 11, 0.75)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--line)'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
          
          {/* Logo */}
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--lime)',
              boxShadow: '0 0 16px var(--lime)'
            }}></span>
            <span className="font-display" style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '0.04em', color: 'var(--ivory)' }}>
              TOZALIK USTASI
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
            <a href="#kalkulyator" style={navLinkStyle}>Kalkulyator</a>
            <a href="#natijalar" style={navLinkStyle}>Natijalar</a>
            <a href="#sharhlar" style={navLinkStyle}>Sharhlar</a>
            <a href="#buyurtma" style={navLinkStyle}>Buyurtma</a>
          </nav>

          {/* CTA & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={onOpenAdmin}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                color: 'var(--ivory-dim)',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '11px',
                fontFamily: 'IBM Plex Mono',
                cursor: 'pointer',
                letterSpacing: '0.15em'
              }}>
              ADMIN
            </button>
            <a href="#buyurtma" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '11px' }}>
              <Sparkles size={14} /> Band qilish
            </a>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--ivory)',
                cursor: 'pointer',
                display: 'none'
              }}
              className="mobile-toggle">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div style={{
            padding: '20px 0',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <a href="#xizmatlar" onClick={() => setMobileOpen(false)} style={mobileLinkStyle}>Xizmatlar</a>
            <a href="#kalkulyator" onClick={() => setMobileOpen(false)} style={mobileLinkStyle}>Kalkulyator</a>
            <a href="#natijalar" onClick={() => setMobileOpen(false)} style={mobileLinkStyle}>Natijalar</a>
            <a href="#sharhlar" onClick={() => setMobileOpen(false)} style={mobileLinkStyle}>Sharhlar</a>
            <a href="#buyurtma" onClick={() => setMobileOpen(false)} style={mobileLinkStyle}>Buyurtma berish</a>
          </div>
        )}
      </div>
    </header>
  );
}

const navLinkStyle = {
  color: 'var(--ivory-dim)',
  fontSize: '12px',
  fontFamily: 'IBM Plex Mono',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  transition: 'color 0.3s ease'
};

const mobileLinkStyle = {
  color: 'var(--ivory)',
  fontSize: '14px',
  fontFamily: 'IBM Plex Mono',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  textDecoration: 'none'
};
