import React, { useState } from 'react';
import { CAR_TYPES as INITIAL_CAR_TYPES, INITIAL_SERVICES } from '../data/mockData';
import { Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ServicesAndCalculator({ services = INITIAL_SERVICES, carTypes = INITIAL_CAR_TYPES, onSelectCalculatorDeal }) {
  const activeCarTypes = (carTypes && carTypes.length > 0) ? carTypes : INITIAL_CAR_TYPES;
  const carTypeOptions = [
    { id: 'all_cars', name: '📌 Barcha mashina turlari', multiplier: 1.0 },
    ...activeCarTypes
  ];

  const [selectedCar, setSelectedCar] = useState(carTypeOptions[0]);

  // Keep selectedCar updated if carTypes change
  React.useEffect(() => {
    if (carTypeOptions && carTypeOptions.length > 0) {
      setSelectedCar(prev => {
        const found = carTypeOptions.find(ct => ct.id === prev?.id);
        return found || carTypeOptions[0];
      });
    }
  }, [carTypes]);

  // Filter services specific to selected car section
  const availableServices = services.filter(svc => {
    if (selectedCar?.id === 'all_cars') return true;
    const rawVal = svc.carTypeIds || svc.carTypeId || 'all';
    const ids = Array.isArray(rawVal) ? rawVal : [rawVal];
    if (ids.includes('all') || ids.includes('all_cars') || ids.length === 0) return true;
    return ids.includes(selectedCar?.id);
  });

  const [selectedServices, setSelectedServices] = useState([]);

  React.useEffect(() => {
    if (availableServices && availableServices.length > 0) {
      setSelectedServices(prev => {
        const validPrev = prev.filter(id => availableServices.some(s => s.id === id));
        if (validPrev.length > 0) return validPrev;
        return [availableServices[0].id];
      });
    } else {
      setSelectedServices([]);
    }
  }, [selectedCar?.id, services]);

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const calculateTotal = () => {
    const baseSum = availableServices
      .filter(s => selectedServices.includes(s.id))
      .reduce((acc, curr) => acc + (Number(curr.basePrice) || 0), 0);
    return Math.round(baseSum * (selectedCar?.multiplier || 1));
  };

  return (
    <section id="kalkulyator" style={{ padding: '80px 20px', maxWidth: '1240px', margin: '0 auto' }}>

      {/* Interactive Live Price Calculator */}
      <div className="glass-card" style={{ padding: 'clamp(24px, 5vw, 48px)', border: '1px solid var(--lime-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Calculator color="var(--lime)" size={28} />
          <h3 className="font-display" style={{ fontSize: '36px' }}>ONLAYN NARX KALKULYATORI</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          
          {/* Step 1: Car Selection */}
          <div>
            <label className="font-mono" style={{ fontSize: '11px', color: 'var(--grey)', letterSpacing: '0.2em', display: 'block', marginBottom: '16px' }}>
              1. MASHINA TURINI TANLANG
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {carTypeOptions.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedCar(type)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: selectedCar?.id === type.id ? 'rgba(200, 255, 61, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${selectedCar?.id === type.id ? 'var(--lime)' : 'var(--glass-border)'}`,
                    color: selectedCar?.id === type.id ? 'var(--lime)' : 'var(--ivory)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '15px'
                  }}>
                  <span>{type.name}</span>
                  {selectedCar?.id === type.id && <CheckCircle2 size={18} color="var(--lime)" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Services Selection */}
          <div>
            <label className="font-mono" style={{ fontSize: '11px', color: 'var(--grey)', letterSpacing: '0.2em', display: 'block', marginBottom: '16px' }}>
              2. {selectedCar?.name || "TANLANGAN MASHINA"} UCHUN XIZMATLAR ({availableServices.length})
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableServices.length === 0 ? (
                <p style={{ color: 'var(--ivory-dim)', fontSize: '13px', fontStyle: 'italic' }}>
                  Ushbu tur uchun alohida xizmatlar hali qo'shilmagan.
                </p>
              ) : (
                availableServices.map((svc) => {
                  const isChecked = selectedServices.includes(svc.id);
                  return (
                    <button
                      key={svc.id}
                      onClick={() => toggleService(svc.id)}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '14px',
                        background: isChecked ? 'rgba(200, 255, 61, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: `1px solid ${isChecked ? 'var(--lime)' : 'var(--glass-border)'}`,
                        color: 'var(--ivory)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '14px'
                      }}>
                      <span>{svc.name}</span>
                      <span className="font-mono" style={{ color: isChecked ? 'var(--lime)' : 'var(--ivory-dim)', fontSize: '13px' }}>
                        +{(svc.basePrice * (selectedCar?.multiplier || 1)).toLocaleString()} so'm
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Live Calculation Total Footer */}
        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span className="font-mono" style={{ fontSize: '11px', color: 'var(--grey)', letterSpacing: '0.2em' }}>JAMI TAXMINIY KIYMAT:</span>
            <div className="font-display" style={{ fontSize: '48px', color: 'var(--lime)', fontWeight: 900 }}>
              {calculateTotal().toLocaleString()} SO'M
            </div>
          </div>
          <button 
            onClick={() => {
              if (onSelectCalculatorDeal) {
                onSelectCalculatorDeal({
                  carType: selectedCar.name,
                  services: services.filter(s => selectedServices.includes(s.id)).map(s => s.name).join(', '),
                  totalPrice: calculateTotal()
                });
              }
              const orderSection = document.getElementById('buyurtma');
              if (orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary" 
            style={{ textDecoration: 'none', border: 'none' }}>
            Ushbu narxda band qilish <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </section>
  );
}
