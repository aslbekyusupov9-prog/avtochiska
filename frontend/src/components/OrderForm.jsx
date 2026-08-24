import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Phone, Calendar, Car, User, FileText, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderForm({ onNewOrder, telegramToken, telegramChatId, calculatorDeal, onUpdateSiteInfo, siteInfo }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    car: '',
    service: "To'liq salon (Kompleks)",
    date: '',
    note: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    if (!formData.name || !formData.phone || !formData.date) {
      setStatus({ type: 'err', msg: "Iltimos, yulduzcha (*) bilan belgilangan barcha maydonlarni to'ldiring." });
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setStatus({ type: 'err', msg: "Telefon raqami kamida 9 ta raqamdan iborat bo'lishi kerak." });
      return;
    }

    setLoading(true);
    const orderId = "AF-" + new Date().getFullYear() + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      ...formData,
      id: orderId,
      status: "Yangi",
      created: new Date().toLocaleString("uz-UZ")
    };

    // Telegram Bot Push Notification logic
    const botToken = telegramToken || "8614777995:AAE0_XIkDSg_6lUDmSf-qEgd43cpZE-9rUk";
    if (botToken) {
      // Async operation to fetch subscribers from Supabase and broadcast
      (async () => {
        try {
          let chatIds = [];
          
          // Import supabase from client config
          const { supabase } = await import('../lib/supabase');
          if (supabase) {
            const { data: subscribers, error } = await supabase
              .from('telegram_subscribers')
              .select('chat_id');
            
            if (!error && subscribers && subscribers.length > 0) {
              chatIds = subscribers.map(s => s.chat_id);
            }
          }

          // Fetch live active chat IDs dynamically from getUpdates so anyone who clicked start receives it
          try {
            const updatesRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
            const updatesData = await updatesRes.json();
            if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
              updatesData.result.forEach(u => {
                const id = u.message?.chat?.id || u.channel_post?.chat?.id;
                if (id) chatIds.push(String(id));
              });
            }
          } catch (_) {}

          // Add known active Chat IDs and fallbacks
          if (telegramChatId) chatIds.push(String(telegramChatId));
          chatIds.push("8935558785", "1681742626", "7338450259");

          // Remove duplicates
          chatIds = [...new Set(chatIds)];

          const text = `🚗 <b>YANGI BUYURTMA! (Tozalik Ustasi)</b>\n\n` +
            `👤 <b>Ism:</b> ${formData.name}\n` +
            `📞 <b>Tel:</b> ${formData.phone}\n` +
            `🚘 <b>Mashina:</b> ${formData.car}\n` +
            `🧼 <b>Xizmat:</b> ${calculatorDeal ? calculatorDeal.services : formData.service}\n` +
            (calculatorDeal ? `💰 <b>Kalkulyator Hisobi:</b> ${Number(calculatorDeal.totalPrice).toLocaleString()} so'm (${calculatorDeal.carType})\n` : '') +
            `📅 <b>Sana:</b> ${formData.date}\n` +
            `📝 <b>Izoh:</b> ${formData.note || "Yo'q"}\n` +
            `🆔 <b>ID:</b> <code>${orderId}</code>`;

          await Promise.all(
            chatIds.map(async (chatId) => {
              try {
                const targetChatId = String(chatId).trim();
                console.log("[Telegram Debug] Broadcasting to:", targetChatId);
                const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: targetChatId,
                    text: text,
                    parse_mode: 'HTML'
                  })
                });
                const resData = await response.json();
                console.log(`[Telegram Debug] Send to ${targetChatId} result:`, resData);
              } catch (err) {
                console.error(`[Telegram Debug] Broadcast to ${chatId} failed:`, err);
              }
            })
          );
        } catch (err) {
          console.error("Telegram broadcast exception:", err);
        }
      })();
    } else {
      console.warn("[Telegram Debug] No telegramToken found.");
    }

    // Local state save
    onNewOrder(newOrder);
    setLoading(false);
    setStatus({
      type: 'ok',
      msg: `Rahmat ${formData.name}! Buyurtmangiz qabul qilindi. Buyurtma ID kodingiz: ${orderId}`
    });

    // Fire success celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setFormData({ name: '', phone: '', car: '', service: "To'liq salon", date: '', note: '' });
  };

  return (
    <section id="buyurtma" style={{ padding: '80px 20px', maxWidth: '1240px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'start' }}>
        
        {/* Info Column */}
        <div>
          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--lime)', letterSpacing: '0.25em' }}>(03) VAQTNI BAND QILISH</span>
          <h2 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 64px)', marginTop: '8px', marginBottom: '24px' }}>
            AVTOMOBILINGIZ UCHUN <span style={{ color: 'var(--lime)' }}>JOY BAND</span> QILING
          </h2>
          <p style={{ color: 'var(--ivory-dim)', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
            Formani to'ldiring. Operatorimiz 15 daqiqa ichida qo'ng'iroq qilib, aniq vaqtni va tavsiyalarni tasdiqlaydi.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(200, 255, 61, 0.1)', color: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-mono" style={{ fontSize: '14px' }}>KAFOLATLANGAN SIFAT</h4>
                <p style={{ color: 'var(--ivory-dim)', fontSize: '13px' }}>100% zararsiz vositalar va sifat kafolati</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(127, 160, 255, 0.1)', color: 'var(--steel)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-mono" style={{ fontSize: '14px' }}>CALL CENTER</h4>
                <p style={{ color: 'var(--ivory-dim)', fontSize: '13px' }}>+998 33 779 80 80 (Har kuni 09:00 - 20:00)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>

          {status.msg && (
            <div style={{
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              background: status.type === 'ok' ? 'rgba(200, 255, 61, 0.12)' : 'rgba(255, 110, 110, 0.12)',
              border: `1px solid ${status.type === 'ok' ? 'var(--lime)' : '#ff6e6e'}`,
              color: status.type === 'ok' ? 'var(--lime)' : '#ff9e9e',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {status.type === 'ok' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span>{status.msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <label className="font-mono" style={labelStyle}>ISMINGIZ *</label>
                <input
                  type="text"
                  placeholder="Ali Valiyev"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="font-mono" style={labelStyle}>TELEFON RAQAM *</label>
                <input
                  type="tel"
                  placeholder="+998 33 779 80 80"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <label className="font-mono" style={labelStyle}>AVTOMOBIL MODELI (IXTIYORIY)</label>
                <input
                  type="text"
                  placeholder="Chevrolet Cobalt, Malibu (ixtiyoriy)..."
                  value={formData.car}
                  onChange={(e) => setFormData({ ...formData, car: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="font-mono" style={labelStyle}>QULAY SANA (DD/MM/YYYY) *</label>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  maxLength={10}
                  value={formData.date}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 2 && val.length <= 4) {
                      val = val.slice(0, 2) + '/' + val.slice(2);
                    } else if (val.length > 4) {
                      val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4, 8);
                    }
                    setFormData({ ...formData, date: val });
                  }}
                  style={{ ...inputStyle, fontFamily: 'IBM Plex Mono' }}
                />
              </div>
            </div>

            <div>
              <label className="font-mono" style={labelStyle}>XIZMAT TURI</label>
              {calculatorDeal ? (
                <div style={{
                  ...inputStyle,
                  background: 'rgba(200, 255, 61, 0.05)',
                  border: '1px solid var(--lime)',
                  color: 'var(--lime)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  fontWeight: 600
                }}>
                  <span>🧼 {calculatorDeal.services} ({calculatorDeal.carType})</span>
                  <span className="font-mono" style={{ fontSize: '12px' }}>{Number(calculatorDeal.totalPrice).toLocaleString()} so'm</span>
                </div>
              ) : (
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  style={{ ...inputStyle, background: 'var(--ink)' }}>
                  <option>To'liq salon</option>
                  <option>O'rindiqlar ximchistkasi</option>
                  <option>Mator chiska</option>
                  <option>Sidenya ximchistka</option>
                  <option>Obshivka Ximchistka</option>
                  <option>Shift Patalok ximchistka</option>
                </select>
              )}
            </div>

            <div>
              <label className="font-mono" style={labelStyle}>QO'SHIMCHA IZOH</label>
              <textarea
                placeholder="Masalan: orqa o'rindiqda qahva dog'i bor..."
                rows={3}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              {loading ? 'Yuborilmoqda...' : 'BUYURTMANI YUBORISH'} <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}

const labelStyle = {
  fontSize: '10px',
  color: 'var(--grey)',
  letterSpacing: '0.2em',
  display: 'block',
  marginBottom: '8px'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--glass-border)',
  color: 'var(--ivory)',
  fontSize: '14px',
  outline: 'none'
};
