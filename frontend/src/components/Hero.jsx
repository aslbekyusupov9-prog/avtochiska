import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';

export default function Hero({ heroContent }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePos = (clientX, rect) => {
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleMouseMove = (e) => {
    if (isDragging || e.buttons === 1) {
      updatePos(e.clientX, e.currentTarget.getBoundingClientRect());
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updatePos(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
    }
  };

  const data = heroContent || {};

  return (
    <section id="top" style={{ padding: '80px 20px 40px', maxWidth: '1240px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'end' }}>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--lime)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            {data.subtitle || "★ Premium Luxury Auto Detailing Studio"}
          </span>
          <h1 style={{ fontSize: 'clamp(52px, 8vw, 110px)', fontWeight: 900, lineHeight: 0.9, marginTop: '16px' }}>
            {data.titleLine1 || "SALON"} <br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--ivory-dim)' }}>{data.titleLine2 || "XIMCHISTKASI"}</span> <br />
            <span style={{ color: 'var(--lime)' }}>{data.titleLine3 || "STUDIYASI"}</span>
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <p style={{ color: 'var(--ivory-dim)', fontSize: '16px', lineHeight: 1.8, marginBottom: '28px' }}>
            {data.description}
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#buyurtma" className="btn-primary" style={{ textDecoration: 'none' }}>
              Onlayn band qilish <ArrowRight size={16} />
            </a>
            <a href="#kalkulyator" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Hisoblash
            </a>
          </div>
        </motion.div>

      </div>

      {/* Touch & Clickable Interactive Before/After Hero Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

        <div
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          onClick={(e) => updatePos(e.clientX, e.currentTarget.getBoundingClientRect())}
          style={{
            position: 'relative',
            height: '420px',
            borderRadius: '24px',
            overflow: 'hidden',
            cursor: 'ew-resize',
            border: '1px solid var(--glass-border)',
            userSelect: 'none',
            touchAction: 'none',
            background: '#090a0f'
          }}>

          {/* After image (Clean interior) */}
          <img
            src={data.heroAfterImg || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000"}
            alt="Tozalangan salon"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
          />

          {/* Before image clipped (Dirty interior) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${sliderPos}%`,
            overflow: 'hidden',
            borderRight: '3px solid var(--lime)',
            pointerEvents: 'none',
            zIndex: 2
          }}>
            <img
              src={data.heroBeforeImg || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"}
              alt="Iflos salon"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', maxWidth: 'none' }}
            />
          </div>

          {/* Touch Draggable Central Handle Circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `${sliderPos}%`,
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--lime)',
            color: '#08090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(200, 255, 61, 0.8)',
            fontWeight: 900,
            fontSize: '16px',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            ◀▶
          </div>

          {/* Clickable Quick Action Buttons for Phones */}
          <button
            onClick={(e) => { e.stopPropagation(); setSliderPos(100); }}
            style={{ position: 'absolute', top: 20, left: 20, zIndex: 12, cursor: 'pointer' }}
            className="btn-secondary">
            OLDIN (100%)
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setSliderPos(0); }}
            style={{ position: 'absolute', top: 20, right: 20, background: 'var(--lime)', color: '#000', zIndex: 12, cursor: 'pointer' }}
            className="btn-secondary">
            KEYIN (100%)
          </button>
        </div>

        {/* Stats card */}
        <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--lime)' }}>
              <Zap size={24} />
              <span className="font-mono" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>TEZKOR XIZMAT</span>
            </div>
            <h3 className="font-serif" style={{ fontSize: '48px', fontWeight: 400, marginTop: '8px' }}>{data.stat1Value || "3–5 Soatda"}</h3>
            <p style={{ color: 'var(--ivory-dim)', fontSize: '14px' }}>{data.stat1Label || "Avtomobilingiz to'liq tozalab, quritib topshiriladi."}</p>
          </div>
          <hr style={{ borderColor: 'var(--line)', margin: '20px 0' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--gold)' }}>
              <Award size={24} />
              <span className="font-mono" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>TAJRIBA</span>
            </div>
            <h3 className="font-serif" style={{ fontSize: '48px', fontWeight: 400, marginTop: '8px' }}>{data.stat2Value || "40+"}</h3>
            <p style={{ color: 'var(--ivory-dim)', fontSize: '14px' }}>{data.stat2Label || "Muvaffaqiyatli tozalangan avtomobillar soni."}</p>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
