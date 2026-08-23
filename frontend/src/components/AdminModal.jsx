import React, { useState } from 'react';
import { X, LayoutDashboard, ShoppingBag, Image as ImageIcon, Star, Settings, Plus, Trash2, CheckCircle2, Shield, Wrench, Car } from 'lucide-react';

export default function AdminModal({
  isOpen,
  onClose,
  orders = [],
  onUpdateStatus,
  onDeleteOrder,
  gallery = [],
  onAddGallery,
  onDeleteGallery,
  reviews = [],
  onAddReview,
  onDeleteReview,
  services = [],
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetServices,
  carTypes = [],
  onAddCarType,
  onDeleteCarType,
  onResetCarTypes,
  onForceSaveCloud,
  heroContent = {},
  onUpdateHero,
  siteInfo = {},
  onUpdateSiteInfo
}) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [saveMsg, setSaveMsg] = useState('');

  const handleSaveAll = () => {
    if (onForceSaveCloud) {
      onForceSaveCloud();
      setSaveMsg("✅ O'zgarishlar va o'chirishlar bulutga hamda barcha qurilmalarga muvaffaqiyatli saqlandi!");
      setTimeout(() => setSaveMsg(''), 4500);
    }
  };

  // Form states
  const [newSvc, setNewSvc] = useState({ number: '07', name: '', description: '', basePrice: 200000, tag: 'Yangi', carTypeId: 'all' });
  const [newCarType, setNewCarType] = useState({ name: '', multiplier: 1.0 });
  const [newRev, setNewRev] = useState({ author: '', car: '', rating: 5, comment: '', date: 'Bugun' });
  const [gTitle, setGTitle] = useState('');
  const [gBefore, setGBefore] = useState('');
  const [gAfter, setGAfter] = useState('');
  const [heroDraft, setHeroDraft] = useState(heroContent);
  const [siteDraft, setSiteDraft] = useState(siteInfo);

  React.useEffect(() => {
    setHeroDraft(heroContent);
  }, [heroContent]);

  React.useEffect(() => {
    setSiteDraft(siteInfo);
  }, [siteInfo]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert("Parol noto'g'ri!");
    }
  };

  const saveHeroChanges = () => {
    onUpdateHero(heroDraft);
    setTimeout(() => handleSaveAll(), 100);
  };

  const saveSiteInfoChanges = () => {
    onUpdateSiteInfo(siteDraft);
    setTimeout(() => handleSaveAll(), 100);
  };

  const handleCreateCarType = (e) => {
    e.preventDefault();
    if (!newCarType.name) return;
    const id = 'ct_' + Date.now();
    if (onAddCarType) {
      onAddCarType({ id, name: newCarType.name, multiplier: Number(newCarType.multiplier) || 1.0 });
    }
    setNewCarType({ name: '', multiplier: 1.0 });
    setTimeout(() => handleSaveAll(), 100);
  };

  const handleCreateService = (e) => {
    e.preventDefault();
    if (!newSvc.name || !newSvc.basePrice) return;
    const num = newSvc.number || String(services.length + 1).padStart(2, '0');
    onAddService({
      ...newSvc,
      id: 's_' + Date.now(),
      number: num,
      basePrice: Number(newSvc.basePrice),
      carTypeId: newSvc.carTypeId || 'all'
    });
    setNewSvc({ number: String(services.length + 2).padStart(2, '0'), name: '', description: '', basePrice: 200000, tag: 'Yangi', carTypeId: 'all' });
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    if (!newRev.author || !newRev.comment) return;
    onAddReview({ ...newRev, id: 'r' + Date.now(), rating: Number(newRev.rating) });
    setNewRev({ author: '', car: '', rating: 5, comment: '', date: 'Bugun' });
    setTimeout(() => handleSaveAll(), 100);
  };

  const handleAddGalItem = (e) => {
    e.preventDefault();
    if (!gTitle || !gBefore || !gAfter) return;
    onAddGallery({ id: 'g' + Date.now(), title: gTitle, before: gBefore, after: gAfter });
    setGTitle(''); setGBefore(''); setGAfter('');
  };

  // Dashboard calculations
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter(o => o.status === 'Yangi').length;
  const completedOrdersCount = orders.filter(o => o.status === 'Bajarildi').length;

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--glass-border)',
    color: 'var(--ivory)',
    fontSize: '13px',
    outline: 'none'
  };

  const labelStyle = {
    fontSize: '11px',
    fontFamily: 'IBM Plex Mono',
    color: 'var(--grey)',
    marginBottom: '6px',
    display: 'block',
    letterSpacing: '0.1em'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(5, 6, 8, 0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: isAuthenticated ? '1100px' : '440px', padding: '36px', maxHeight: '92vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LayoutDashboard color="var(--lime)" size={24} />
            <h3 className="font-display" style={{ fontSize: '24px' }}>
              ENTERPRISE DASHBOARD & CONTROL CENTER
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated && (
              <button
                onClick={handleSaveAll}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '12px', background: 'var(--lime)', color: '#08090b', fontWeight: 'bold' }}>
                <CheckCircle2 size={16} /> SAQLASH (SAVE TO CLOUD)
              </button>
            )}
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ivory)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        {saveMsg && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(200,255,61,0.15)', border: '1px solid var(--lime)', color: 'var(--lime)', fontSize: '13px', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>
            {saveMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(200,255,61,0.1)', color: 'var(--lime)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Shield size={28} />
              </div>
              <h4 className="font-display" style={{ fontSize: '22px' }}>ADMINISTRATOR KIRISHI</h4>
              <p style={{ color: 'var(--ivory-dim)', fontSize: '13px', marginTop: '4px' }}>Boshqaruv paneliga kirish uchun parolni kiriting</p>
            </div>

            <div>
              <label style={labelStyle}>PAROL</label>
              <input 
                type="password" 
                placeholder="Parolni kiriting..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                autoFocus
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              PANELGA KIRISH <CheckCircle2 size={16} />
            </button>
          </form>
        ) : (
          /* AUTHENTICATED CONTROL CENTER */
          <div>
            {/* TABS NAVIGATION */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', borderBottom: '1px solid var(--line)' }}>
              {[
                { id: 'stats', label: 'DASHBOARD STATS', icon: LayoutDashboard },
                { id: 'orders', label: `BUYURTMALAR (${orders.length})`, icon: ShoppingBag },
                { id: 'cartypes', label: `MASHINA TURLARI (${carTypes.length})`, icon: Car },
                { id: 'hero', label: "HERO BO'LIMI", icon: Wrench },
                { id: 'services', label: `XIZMATLAR (${services.length})`, icon: Wrench },
                { id: 'gallery', label: `GALEREYA (${gallery.length})`, icon: ImageIcon },
                { id: 'reviews', label: `SHARHLAR (${reviews.length})`, icon: Star },
                { id: 'settings', label: 'SOZLAMALAR & TELEGRAM', icon: Settings },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '999px',
                      border: isActive ? '1px solid var(--lime)' : '1px solid var(--glass-border)',
                      background: isActive ? 'var(--lime)' : 'rgba(255,255,255,0.02)',
                      color: isActive ? '#08090b' : 'var(--ivory)',
                      fontSize: '11px',
                      fontFamily: 'IBM Plex Mono',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}>
                    <Icon size={14} /> {tab.label}
                  </button>
                );
              })}
              <button 
                onClick={() => setIsAuthenticated(false)}
                style={{ padding: '10px 18px', borderRadius: '999px', background: 'rgba(255,100,100,0.1)', border: '1px solid #ff6464', color: '#ff9999', fontSize: '11px', cursor: 'pointer', marginLeft: 'auto' }}>
                LOGOUT
              </button>
            </div>

            {/* TAB 1: STATS */}
            {activeTab === 'stats' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(200,255,61,0.05)', border: '1px solid var(--lime-glow)' }}>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--grey)' }}>JAMI BUYURTMALAR</span>
                    <h3 className="font-display" style={{ fontSize: '42px', color: 'var(--lime)', marginTop: '4px' }}>{totalOrdersCount}</h3>
                  </div>
                  <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(127,160,255,0.05)', border: '1px solid var(--glass-border)' }}>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--grey)' }}>YANGI BUYURTMALAR</span>
                    <h3 className="font-display" style={{ fontSize: '42px', color: 'var(--steel)', marginTop: '4px' }}>{newOrdersCount}</h3>
                  </div>
                  <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--grey)' }}>BAJARILGAN</span>
                    <h3 className="font-display" style={{ fontSize: '42px', color: 'var(--ivory)', marginTop: '4px' }}>{completedOrdersCount}</h3>
                  </div>
                </div>

                <h4 className="font-display" style={{ fontSize: '20px', marginBottom: '16px' }}>OXIRGI BUYURTMALAR</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="font-mono" style={{ color: 'var(--lime)', fontSize: '12px' }}>{o.id}</span>
                        <h5 style={{ fontSize: '16px', marginTop: '2px' }}>{o.name} · {o.phone}</h5>
                        <p style={{ color: 'var(--ivory-dim)', fontSize: '13px' }}>{o.car} — {o.service}</p>
                      </div>
                      <span className="font-mono" style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(200,255,61,0.1)', color: 'var(--lime)' }}>
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--grey)', padding: '40px' }}>Hozircha buyurtmalar yo'q.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <span className="font-mono" style={{ color: 'var(--lime)', fontSize: '13px' }}>{o.id}</span>
                          <h4 style={{ fontSize: '18px', margin: '4px 0' }}>{o.name} · {o.phone}</h4>
                          <p style={{ color: 'var(--ivory-dim)', fontSize: '13px' }}>{o.car} — {o.service} | Sana: {o.date}</p>
                          {o.note && <p style={{ color: 'var(--grey)', fontSize: '12px', marginTop: '4px' }}>Izoh: {o.note}</p>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <select
                            value={o.status}
                            onChange={(e) => onUpdateStatus(o.id, e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--ink)', border: '1px solid var(--glass-border)', color: 'var(--ivory)', fontSize: '12px' }}>
                            <option>Yangi</option>
                            <option>Jarayonda</option>
                            <option>Bajarildi</option>
                          </select>
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteOrder(o.id); }}
                            style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,110,110,0.15)', border: '1px solid #ff6e6e', color: '#ff9e9e', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: EDIT HERO SECTION */}
            {activeTab === 'hero' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 className="font-display" style={{ fontSize: '22px' }}>HERO BOSH SAHIFA MATNLARINI TAHRIRLASH</h4>
                <div>
                  <label style={labelStyle}>KICHIK SARLAVHA (SUBTITLE)</label>
                  <input value={heroDraft.subtitle || ''} onChange={e => setHeroDraft({ ...heroDraft, subtitle: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>SARLAVHA 1-QATOR</label>
                    <input value={heroDraft.titleLine1 || ''} onChange={e => setHeroDraft({ ...heroDraft, titleLine1: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>SARLAVHA 2-QATOR (STROKE)</label>
                    <input value={heroDraft.titleLine2 || ''} onChange={e => setHeroDraft({ ...heroDraft, titleLine2: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>SARLAVHA 3-QATOR (YASHIL)</label>
                    <input value={heroDraft.titleLine3 || ''} onChange={e => setHeroDraft({ ...heroDraft, titleLine3: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>TAFSIF MATNI</label>
                  <textarea value={heroDraft.description || ''} onChange={e => setHeroDraft({ ...heroDraft, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px' }} />
                </div>

                {/* Hero Before & After Image controls */}
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h5 className="font-display" style={{ color: 'var(--lime)', fontSize: '16px' }}>INTERAKTIV SLAYDER RASMLARI (OLDIN & KEYIN)</h5>
                  
                  <div>
                    <label style={labelStyle}>"OLDIN" RASMI (QURILMADAN TANLANG YOKI URL KIRITING)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="heroFileBefore" 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = 1000;
                                canvas.height = 600;
                                const ctx = canvas.getContext('2d');
                                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                                const x = (canvas.width / 2) - (img.width / 2) * scale;
                                const y = (canvas.height / 2) - (img.height / 2) * scale;
                                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                                setHeroDraft({ ...heroDraft, heroBeforeImg: canvas.toDataURL('image/jpeg', 0.8) });
                              };
                              img.src = ev.target.result;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="heroFileBefore" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '11px', cursor: 'pointer' }}>
                        📁 Qurilmadan rasm
                      </label>
                      <input 
                        placeholder="Yoki URL manzil" 
                        value={heroDraft.heroBeforeImg || ''} 
                        onChange={e => setHeroDraft({ ...heroDraft, heroBeforeImg: e.target.value })} 
                        style={{ ...inputStyle, flex: 1 }} 
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>"KEYIN" RASMI (QURILMADAN TANLANG YOKI URL KIRITING)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="heroFileAfter" 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = 1000;
                                canvas.height = 600;
                                const ctx = canvas.getContext('2d');
                                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                                const x = (canvas.width / 2) - (img.width / 2) * scale;
                                const y = (canvas.height / 2) - (img.height / 2) * scale;
                                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                                setHeroDraft({ ...heroDraft, heroAfterImg: canvas.toDataURL('image/jpeg', 0.8) });
                              };
                              img.src = ev.target.result;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="heroFileAfter" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '11px', cursor: 'pointer' }}>
                        📁 Qurilmadan rasm
                      </label>
                      <input 
                        placeholder="Yoki URL manzil" 
                        value={heroDraft.heroAfterImg || ''} 
                        onChange={e => setHeroDraft({ ...heroDraft, heroAfterImg: e.target.value })} 
                        style={{ ...inputStyle, flex: 1 }} 
                      />
                    </div>
                  </div>
                </div>

                <button onClick={saveHeroChanges} className="btn-primary" style={{ marginTop: '10px' }}>
                  <CheckCircle2 size={16} /> HERO SAQLASH
                </button>
              </div>
            )}

            {/* TAB: EDIT CAR TYPES */}
            {activeTab === 'cartypes' && (
              <div>
                <h4 className="font-display" style={{ fontSize: '22px', marginBottom: '16px' }}>YANGI MASHINA TURI QO'SHISH</h4>
                <form onSubmit={handleCreateCarType} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}>
                  <div>
                    <label style={labelStyle}>MASHINA TURI NOMI *</label>
                    <input placeholder="Masalan: Gruzovoy / Pikap" value={newCarType.name} onChange={e => setNewCarType({ ...newCarType, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>NARX KOEFFITSIENTI (MULTIPLIER) *</label>
                    <input placeholder="1.0, 1.2, 1.5..." type="number" step="0.05" value={newCarType.multiplier} onChange={e => setNewCarType({ ...newCarType, multiplier: e.target.value })} style={inputStyle} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ padding: '10px', fontSize: '11px', gridColumn: '1/-1', marginTop: '6px' }}>
                    <Plus size={14} /> Mashina turini qo'shish
                  </button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 className="font-display" style={{ fontSize: '22px', margin: 0 }}>MAVJUD MASHINA TURLARI</h4>
                  {onResetCarTypes && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Barcha mashina turlarini standart holatga qaytarishni xohlaysizmi?")) {
                          onResetCarTypes();
                        }
                      }}
                      style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(200,255,61,0.1)', border: '1px solid var(--lime)', color: 'var(--lime)', fontSize: '12px', cursor: 'pointer' }}>
                      Standart turlarga qaytarish (Reset)
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {carTypes.map(ct => (
                    <div key={ct.id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ fontSize: '16px' }}>{ct.name}</h5>
                        <p style={{ color: 'var(--lime)', fontSize: '13px', fontFamily: 'IBM Plex Mono' }}>Koeffitsient: x{ct.multiplier}</p>
                      </div>
                      {onDeleteCarType && (
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteCarType(ct.id);
                            setTimeout(() => handleSaveAll(), 100);
                          }} 
                          style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,110,110,0.15)', border: '1px solid #ff6e6e', color: '#ff9e9e', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '24px', padding: '14px', justifyContent: 'center', fontSize: '13px' }}>
                  <CheckCircle2 size={18} /> BARCHA O'ZGARISHLARNI BULUTGA SAQLASH (SAVE TO CLOUD)
                </button>
              </div>
            )}

            {/* TAB 4: EDIT SERVICES */}
            {activeTab === 'services' && (
              <div>
                <h4 className="font-display" style={{ fontSize: '22px', marginBottom: '16px' }}>YANGI XIZMAT QO'SHISH</h4>
                <form onSubmit={handleCreateService} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}>
                  <input placeholder="Nomer (Masalan: 05)" value={newSvc.number} onChange={e => setNewSvc({ ...newSvc, number: e.target.value })} style={inputStyle} />
                  <input placeholder="Xizmat nomi" value={newSvc.name} onChange={e => setNewSvc({ ...newSvc, name: e.target.value })} style={inputStyle} />
                  <input placeholder="Boshlang'ich narx (so'm)" type="number" value={newSvc.basePrice} onChange={e => setNewSvc({ ...newSvc, basePrice: e.target.value })} style={inputStyle} />
                  <select
                    value={newSvc.carTypeId || 'all'}
                    onChange={e => setNewSvc({ ...newSvc, carTypeId: e.target.value })}
                    style={{ ...inputStyle, background: '#12141a' }}>
                    <option value="all">📌 Barcha mashina turlari uchun</option>
                    {carTypes.map(ct => (
                      <option key={ct.id} value={ct.id}>🚗 Faqat {ct.name} uchun</option>
                    ))}
                  </select>
                  <input placeholder="Tavsif" value={newSvc.description} onChange={e => setNewSvc({ ...newSvc, description: e.target.value })} style={{ ...inputStyle, gridColumn: '1/-1' }} />
                  <button type="submit" className="btn-primary" style={{ padding: '10px', fontSize: '11px', gridColumn: '1/-1' }}>
                    <Plus size={14} /> Xizmatni qo'shish
                  </button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 className="font-display" style={{ fontSize: '22px', margin: 0 }}>MAVJUD XIZMATLAR</h4>
                  {onResetServices && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Barcha xizmatlarni standart holatga qaytarishni xohlaysizmi?")) {
                          onResetServices();
                        }
                      }}
                      style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(200,255,61,0.1)', border: '1px solid var(--lime)', color: 'var(--lime)', fontSize: '12px', cursor: 'pointer' }}>
                      Barcha xizmatlarni qaytarish (Reset)
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {services.map(svc => {
                    return (
                      <div key={svc.id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <h5 style={{ fontSize: '16px' }}>{svc.number}. {svc.name}</h5>
                          <p style={{ color: 'var(--lime)', fontSize: '14px', margin: '4px 0' }}>{Number(svc.basePrice).toLocaleString()} so'm</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <select
                            value={svc.carTypeId || 'all'}
                            onChange={(e) => {
                              if (onUpdateService) {
                                onUpdateService(svc.id, { carTypeId: e.target.value });
                                setTimeout(() => handleSaveAll(), 100);
                              }
                            }}
                            style={{ ...inputStyle, width: 'auto', padding: '6px 12px', background: '#12141a', color: 'var(--lime)', border: '1px solid var(--lime-glow)' }}>
                            <option value="all">📌 Barcha turlar uchun</option>
                            {carTypes.map(ct => (
                              <option key={ct.id} value={ct.id}>🚗 Faqat {ct.name} uchun</option>
                            ))}
                          </select>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDeleteService(svc.id);
                              setTimeout(() => handleSaveAll(), 100);
                            }} 
                            style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,110,110,0.15)', border: '1px solid #ff6e6e', color: '#ff9e9e', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '24px', padding: '14px', justifyContent: 'center', fontSize: '13px' }}>
                  <CheckCircle2 size={18} /> BARCHA O'ZGARISHLARNI BULUTGA SAQLASH (SAVE TO CLOUD)
                </button>
              </div>
            )}

            {/* TAB 5: GALLERY MANAGEMENT */}
            {activeTab === 'gallery' && (
              <div>
                <form onSubmit={handleAddGalItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                  <h4 className="font-display" style={{ fontSize: '18px', color: 'var(--lime)' }}>YANGI RASM JUFTLIGI QO'SHISH</h4>
                  
                  <div>
                    <label style={labelStyle}>SARLAVHA *</label>
                    <input placeholder="Masalan: Cobalt — To'liq ximchistka" value={gTitle} onChange={e => setGTitle(e.target.value)} style={inputStyle} />
                  </div>

                  {/* Before Image Selector */}
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed var(--line)' }}>
                    <label style={labelStyle}>"OLDIN" RASMI (QURILMADAN TANLANG YOKI URL KIRITING) *</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="fileBefore"
                        style={{ display: 'none' }} 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = 800;
                                canvas.height = 600;
                                const ctx = canvas.getContext('2d');
                                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                                const x = (canvas.width / 2) - (img.width / 2) * scale;
                                const y = (canvas.height / 2) - (img.height / 2) * scale;
                                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                                setGBefore(canvas.toDataURL('image/jpeg', 0.8));
                              };
                              img.src = event.target.result;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="fileBefore" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px', cursor: 'pointer' }}>
                        📁 Qurilmadan rasm tanlash
                      </label>
                      <input placeholder="Yoki rasm URL manzili" value={gBefore} onChange={e => setGBefore(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    </div>
                    {gBefore && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={gBefore} alt="Before Preview" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                        <span style={{ fontSize: '12px', color: 'var(--lime)' }}>✓ "Oldin" rasm tayyorlandi (Optimallashgan)</span>
                      </div>
                    )}
                  </div>

                  {/* After Image Selector */}
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed var(--line)' }}>
                    <label style={labelStyle}>"KEYIN" RASMI (QURILMADAN TANLANG YOKI URL KIRITING) *</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="fileAfter"
                        style={{ display: 'none' }} 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = 800;
                                canvas.height = 600;
                                const ctx = canvas.getContext('2d');
                                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                                const x = (canvas.width / 2) - (img.width / 2) * scale;
                                const y = (canvas.height / 2) - (img.height / 2) * scale;
                                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                                setGAfter(canvas.toDataURL('image/jpeg', 0.8));
                              };
                              img.src = event.target.result;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="fileAfter" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px', cursor: 'pointer' }}>
                        📁 Qurilmadan rasm tanlash
                      </label>
                      <input placeholder="Yoki rasm URL manzili" value={gAfter} onChange={e => setGAfter(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    </div>
                    {gAfter && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={gAfter} alt="After Preview" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                        <span style={{ fontSize: '12px', color: 'var(--lime)' }}>✓ "Keyin" rasm tayyorlandi (Optimallashgan)</span>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '12px 20px', fontSize: '11px', marginTop: '8px' }}>
                    GALEREYAGA QO'SHISH <Plus size={14} />
                  </button>
                </form>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {gallery.map((g) => (
                    <div key={g.id} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{g.title}</p>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteGallery(g.id);
                        }} 
                        style={{ padding: '6px 12px', width: '100%', borderRadius: '8px', background: 'rgba(255,110,110,0.15)', border: '1px solid #ff6e6e', color: '#ff9e9e', fontSize: '11px', cursor: 'pointer' }}>
                        O'chirish
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: REVIEWS */}
            {activeTab === 'reviews' && (
              <div>
                <form onSubmit={handleCreateReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}>
                  <input placeholder="Muallif ismi" value={newRev.author} onChange={e => setNewRev({ ...newRev, author: e.target.value })} style={inputStyle} />
                  <input placeholder="Avto modeli (Masalan: Cobalt)" value={newRev.car} onChange={e => setNewRev({ ...newRev, car: e.target.value })} style={inputStyle} />
                  <textarea placeholder="Sharh matni" value={newRev.comment} onChange={e => setNewRev({ ...newRev, comment: e.target.value })} style={{ ...inputStyle, minHeight: '70px' }} />
                  <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '11px' }}>Qo'shish <Plus size={14} /></button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {reviews.map(r => (
                    <div key={r.id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ fontSize: '15px' }}>{r.author} <span style={{ color: 'var(--grey)', fontSize: '12px' }}>({r.car})</span></h5>
                        <p style={{ color: 'var(--ivory-dim)', fontSize: '13px', marginTop: '4px' }}>"{r.comment}"</p>
                      </div>
                      <button type="button" onClick={() => onDeleteReview(r.id)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,110,110,0.15)', border: '1px solid #ff6e6e', color: '#ff9e9e', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: SETTINGS & TELEGRAM */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 className="font-display" style={{ fontSize: '22px' }}>TELEGRAM BOT & ALOQA SOZLAMALARI</h4>
                <div>
                  <label style={labelStyle}>TELEGRAM BOT TOKEN</label>
                  <input value={siteDraft.telegramToken || ''} onChange={e => setSiteDraft({ ...siteDraft, telegramToken: e.target.value })} style={inputStyle} placeholder="8925592658:AAGYwLX..." />
                </div>
                <div>
                  <label style={labelStyle}>TELEGRAM CHAT ID (AVTOMATIK ANIQLANADI)</label>
                  <input value={siteDraft.telegramChatId || ''} onChange={e => setSiteDraft({ ...siteDraft, telegramChatId: e.target.value })} style={inputStyle} placeholder="Chat ID" />
                </div>
                <div>
                  <label style={labelStyle}>MANZIL MATNI</label>
                  <input value={siteDraft.address || ''} onChange={e => setSiteDraft({ ...siteDraft, address: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>TELEFON 1</label>
                    <input value={siteDraft.phone1 || ''} onChange={e => setSiteDraft({ ...siteDraft, phone1: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>TELEFON 2</label>
                    <input value={siteDraft.phone2 || ''} onChange={e => setSiteDraft({ ...siteDraft, phone2: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <button onClick={saveSiteInfoChanges} className="btn-primary" style={{ marginTop: '10px' }}>
                  <CheckCircle2 size={16} /> SOZLAMALARNI SAQLASH
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
