import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesAndCalculator from './components/ServicesAndCalculator';
import OrderForm from './components/OrderForm';
import AdminModal from './components/AdminModal';
import { INITIAL_GALLERY, INITIAL_REVIEWS, INITIAL_SERVICES, INITIAL_HERO, INITIAL_SITE_INFO, INITIAL_CAR_TYPES } from './data/mockData';
import { Star, MapPin } from 'lucide-react';

import { fetchLiveCloudState, saveLiveCloudState, subscribeToTabSync } from './services/liveSync';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [gallery, setGallery] = useState(INITIAL_GALLERY);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [carTypes, setCarTypes] = useState(INITIAL_CAR_TYPES);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [heroContent, setHeroContent] = useState(INITIAL_HERO);
  const [siteInfo, setSiteInfo] = useState(INITIAL_SITE_INFO);

  const [adminOpen, setAdminOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCloudLoading, setIsCloudLoading] = useState(true);

  const applyRemoteState = (remote) => {
    if (!remote) return;
    if (Array.isArray(remote.services)) {
      setServices(remote.services);
    }
    if (Array.isArray(remote.carTypes)) {
      setCarTypes(remote.carTypes);
    }
    if (Array.isArray(remote.gallery)) {
      setGallery(remote.gallery);
    }
    if (Array.isArray(remote.reviews)) {
      setReviews(remote.reviews);
    }
    if (remote.heroContent && typeof remote.heroContent === 'object' && Object.keys(remote.heroContent).length > 0) {
      const updatedHero = { ...remote.heroContent };
      if (updatedHero.stat2Value === "4,200+") {
        updatedHero.stat2Value = "40+";
      }
      setHeroContent(updatedHero);
    }
    if (remote.siteInfo && typeof remote.siteInfo === 'object' && Object.keys(remote.siteInfo).length > 0) {
      const updatedSiteInfo = { ...remote.siteInfo };
      if (updatedSiteInfo.phone2 === "+998 71 200 11 22") {
        updatedSiteInfo.phone2 = "+998 33 779 80 80";
      }
      setSiteInfo(updatedSiteInfo);
    }
    if (Array.isArray(remote.orders)) setOrders(remote.orders);
  };

  useEffect(() => {
    let unsubscribeTab = () => {};

    const initCloud = async () => {
      // 1. Supabase'dan ma'lumot olish
      const remote = await fetchLiveCloudState();
      if (remote) {
        applyRemoteState(remote);
      }
      setIsCloudLoading(false);

      // 2. Real-time subscribe
      unsubscribeTab = subscribeToTabSync((remoteData) => {
        applyRemoteState(remoteData);
      });

      setIsLoaded(true);
    };

    initCloud();

    return () => {
      unsubscribeTab();
    };
  }, []);

  // Save changes strictly to Public Cloud Server (Supabase)
  useEffect(() => {
    if (!isLoaded) return;
    saveLiveCloudState({ orders, gallery, services, carTypes, reviews, heroContent, siteInfo });
  }, [orders, gallery, services, carTypes, reviews, heroContent, siteInfo, isLoaded]);

  const handleNewOrder = (order) => setOrders([order, ...orders]);
  const handleUpdateStatus = (id, newStatus) => setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  const handleDeleteOrder = (id) => setOrders(orders.filter(o => o.id !== id));

  const handleAddGallery = (item) => setGallery([item, ...gallery]);
  const handleDeleteGallery = (id) => setGallery(gallery.filter(g => g.id !== id));

  const handleAddService = (svc) => setServices([...services, svc]);
  const handleUpdateService = (id, updatedFields) => setServices(services.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  const handleDeleteService = (id) => setServices(services.filter(s => s.id !== id));
  const handleResetServices = () => setServices(INITIAL_SERVICES);

  const handleAddCarType = (ct) => setCarTypes([...carTypes, ct]);
  const handleDeleteCarType = (id) => setCarTypes(carTypes.filter(c => c.id !== id));
  const handleResetCarTypes = () => setCarTypes(INITIAL_CAR_TYPES);

  const handleForceSaveCloud = () => {
    saveLiveCloudState({ orders, gallery, services, carTypes, reviews, heroContent, siteInfo });
  };

  const handleAddReview = (rev) => setReviews([rev, ...reviews]);
  const handleDeleteReview = (id) => setReviews(reviews.filter(r => r.id !== id));

  const [calculatorDeal, setCalculatorDeal] = useState(null);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };

  if (isCloudLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(200,255,61,0.15)',
          borderTopColor: 'var(--lime)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p className="font-mono" style={{ color: 'var(--lime)', fontSize: '12px', letterSpacing: '0.2em' }}>
          YUKLANMOQDA...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)' }}>
      <Header onOpenAdmin={() => setAdminOpen(true)} />

      <main>
        <Hero heroContent={heroContent} />

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
          <ServicesAndCalculator services={services} carTypes={carTypes} onSelectCalculatorDeal={(deal) => setCalculatorDeal(deal)} />
        </motion.div>

        {/* Gallery Archive */}
        <motion.section
          id="natijalar"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionVariants}
          style={{ padding: '80px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <span className="font-mono" style={{ fontSize: '11px', color: 'var(--lime)', letterSpacing: '0.25em' }}>(04) ARXIV</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 64px)', marginTop: '8px' }}>
              HAQIQIY <span style={{ color: 'var(--lime)' }}>BAJARILGAN</span> ISHLAR
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {gallery.map((g) => (
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} key={g.id} className="glass-card" style={{ padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', height: '240px', borderRadius: '14px', overflow: 'hidden', background: 'rgba(0,0,0,0.4)', position: 'relative' }}>
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={g.before} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.75)', color: 'var(--ivory)', fontSize: '10px', padding: '3px 8px', borderRadius: '6px', fontFamily: 'IBM Plex Mono', border: '1px solid rgba(255,255,255,0.1)' }}>OLDIN</span>
                  </div>
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={g.after} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--lime)', color: '#000', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', fontFamily: 'IBM Plex Mono' }}>KEYIN</span>
                  </div>
                </div>
                <h4 className="font-display" style={{ fontSize: '20px', marginTop: '16px' }}>{g.title}</h4>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials & User Review Submission */}
        <motion.section
          id="sharhlar"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionVariants}
          style={{ padding: '80px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <span className="font-mono" style={{ fontSize: '11px', color: 'var(--lime)', letterSpacing: '0.25em' }}>(05) SHARHLAR</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 64px)', marginTop: '8px' }}>
              MIJOZLARIMIZ <span style={{ color: 'var(--lime)' }}>FIKRI</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {reviews.map((rev) => (
              <motion.div whileHover={{ y: -6 }} key={rev.id} className="glass-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', gap: '4px', color: 'var(--lime)', marginBottom: '12px' }}>
                  {[...Array(rev.rating || 5)].map((_, i) => <Star key={i} size={16} fill="var(--lime)" />)}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--ivory-dim)', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                  "{rev.comment}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600 }}>{rev.author}</span>
                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--grey)' }}>{rev.car}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
          <OrderForm
            onNewOrder={handleNewOrder}
            telegramToken={siteInfo.telegramToken}
            telegramChatId={siteInfo.telegramChatId}
            calculatorDeal={calculatorDeal}
            onUpdateSiteInfo={setSiteInfo}
            siteInfo={siteInfo}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '80px 20px 40px', background: 'rgba(5, 6, 8, 0.95)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '60px' }}>
            <div>
              <h4 className="font-display" style={{ fontSize: '28px', color: 'var(--lime)', marginBottom: '16px' }}>TOZALIK USTASI</h4>
              <p style={{ color: 'var(--ivory-dim)', fontSize: '14px', lineHeight: 1.7 }}>
                Avtomobil salon ximchistkasi: o'rindiq, gilam, shift va butun salonni chuqur tozalash.
              </p>
            </div>
            <div>
              <h5 className="font-mono" style={{ fontSize: '12px', color: 'var(--grey)', letterSpacing: '0.2em', marginBottom: '16px' }}>MANZIL</h5>
              <p style={{ color: 'var(--ivory-dim)', fontSize: '14px', lineHeight: 1.7 }}>
                <MapPin size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {siteInfo.address}
              </p>
            </div>
            <div>
              <h5 className="font-mono" style={{ fontSize: '12px', color: 'var(--grey)', letterSpacing: '0.2em', marginBottom: '16px' }}>BIZ IJTIMOIY TARMOQLARDA</h5>
              <p style={{ color: 'var(--ivory-dim)', fontSize: '14px', lineHeight: 1.8 }}>
                <a href={siteInfo.telegramUrl || "https://t.me/tozalik_ustasi"} target="_blank" rel="noreferrer" style={{ color: 'var(--lime)', textDecoration: 'none' }}>Telegram</a><br />
                <a href={siteInfo.instagramUrl || "https://www.instagram.com/tozalik.ustasi/"} target="_blank" rel="noreferrer" style={{ color: 'var(--lime)', textDecoration: 'none' }}>Instagram</a>
              </p>
            </div>
            <div>
              <h5 className="font-mono" style={{ fontSize: '12px', color: 'var(--grey)', letterSpacing: '0.2em', marginBottom: '16px' }}>ALOQA</h5>
              <p className="font-mono" style={{ color: 'var(--ivory)', fontSize: '14px', lineHeight: 1.8 }}>
                {siteInfo.phone1}
                {siteInfo.phone2 && siteInfo.phone2 !== siteInfo.phone1 && <><br />{siteInfo.phone2}</>}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid var(--line)', color: 'var(--grey)', fontSize: '12px' }} className="font-mono">
            © {new Date().getFullYear()} TOZALIK USTASI
          </div>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        orders={orders}
        onUpdateStatus={handleUpdateStatus}
        onDeleteOrder={handleDeleteOrder}
        gallery={gallery}
        onAddGallery={handleAddGallery}
        onDeleteGallery={handleDeleteGallery}
        reviews={reviews}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
        services={services}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        onResetServices={handleResetServices}
        carTypes={carTypes}
        onAddCarType={handleAddCarType}
        onDeleteCarType={handleDeleteCarType}
        onResetCarTypes={handleResetCarTypes}
        onForceSaveCloud={handleForceSaveCloud}
        heroContent={heroContent}
        onUpdateHero={setHeroContent}
        siteInfo={siteInfo}
        onUpdateSiteInfo={setSiteInfo}
      />
    </div>
  );
}
