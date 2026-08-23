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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
            background: '#090a0f',
            transform: 'translateZ(0)'
          }}>

          {/* After image (Clean interior) */}
          <img
            src={data.heroAfterImg || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000"}
            alt="Tozalangan salon"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              pointerEvents: 'none',
              transition: 'none',
              transform: 'translateZ(0)'
            }}
          />

          {/* Before image clipped (Dirty interior - motionless static reveal) */}
          <img
            src={data.heroBeforeImg || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"}
            alt="Iflos salon"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              pointerEvents: 'none',
              transition: 'none',
              transform: 'translateZ(0)',
              willChange: 'clip-path',
              clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              WebkitClipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
            }}
          />

          {/* Dividing Vertical Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPos}%`,
            width: '3px',
            background: 'var(--lime)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 3,
            boxShadow: '0 0 12px rgba(200, 255, 61, 0.6)'
          }} />

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
