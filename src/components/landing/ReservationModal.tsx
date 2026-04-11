import React, { useState, useEffect } from 'react';
import { Package, Reservation, FormErrors } from '@/types/reservation';
import ReservationForm from './ReservationForm';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: Reservation;
  errors: FormErrors;
  packages: Package[];
  selectedPackage: string | null;
  onFormChange: (updates: Partial<Reservation>) => void;
  onSubmit: () => void;
}

export default function ReservationModal({
  isOpen,
  onClose,
  form,
  errors,
  packages,
  selectedPackage,
  onFormChange,
  onSubmit,
}: ReservationModalProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setImgIndex(0);
      setStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pkg = packages.find(p => p.id === selectedPackage);
  const images = pkg?.image_urls && pkg.image_urls.length > 0 ? pkg.image_urls : null;
  const currentImage = images ? images[imgIndex] : null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images) setImgIndex((i) => (i + 1) % images.length);
  };
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images) setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  return (
    <div className="crm-modal-overlay" onClick={onClose} style={{ zIndex: 9999, padding: '20px' }}>
      <div 
        className="reservation-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--cream)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: step === 0 ? '420px' : (step === 1 ? '500px' : '650px'),
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 40px 60px rgba(0,0,0,0.4)',
          position: 'relative',
          animation: 'fadeIn 0.3s ease',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: step < 2 && currentImage ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            color: step < 2 && currentImage ? '#FFF' : 'var(--txt-main)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <X size={20} />
        </button>

        {step > 0 && (
          <button 
            onClick={() => setStep(step - 1)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: step < 2 && currentImage ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              color: step < 2 && currentImage ? '#FFF' : 'var(--txt-main)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: !showForm && pkg ? '20px' : '20px',
            background: 'rgba(0,0,0,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            color: !showForm && pkg && currentImage ? '#FFF' : 'var(--txt-main)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <X size={20} />
        </button>

        {pkg && step < 2 && (
          <div className="res-modal-pkg-info" style={{
            flex: '1',
            background: currentImage 
              ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url(${currentImage})` 
              : `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.85))`,
            backgroundColor: pkg.color,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            color: '#FFF',
            minHeight: step === 0 ? 'min(75vh, 600px)' : 'auto',
            aspectRatio: step === 0 ? '3/4' : 'auto',
            position: 'relative',
            overflowY: 'auto'
          }}>

            {images && images.length > 1 && (
              <>
                <button onClick={handlePrev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer', backdropFilter: 'blur(4px)', zIndex: 10 }}>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNext} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer', backdropFilter: 'blur(4px)', zIndex: 10 }}>
                  <ChevronRight size={20} />
                </button>
                <div style={{ position: 'absolute', bottom: step === 0 ? 90 : 16, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 6, zIndex: 10 }}>
                  {images.map((_, i) => (
                    <div key={i} style={{ width: i === imgIndex ? 20 : 6, height: 6, borderRadius: 3, background: i === imgIndex ? 'var(--red)' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s' }} />
                  ))}
                </div>
              </>
            )}

            <div style={{ position: 'relative', zIndex: 5, marginTop: step === 1 ? '160px' : 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ background: 'var(--red)', color: '#FFF', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                  {pkg.tag}
                </span>
                {pkg.price && (
                  <span style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--red)', padding: '6px 16px', borderRadius: '20px', fontSize: '15px', fontWeight: 900, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.2)' }}>
                    {pkg.price}
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '32px', fontFamily: "'Playfair Display', serif", marginBottom: '12px', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>{pkg.title}</h3>
              
              {step === 0 && (
                <>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', marginBottom: '24px', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    {pkg.desc}
                  </p>
                  <button 
                    onClick={() => setStep(1)}
                    className="btn-primary animate-in slide-in-from-bottom-4 fade-in duration-300"
                    style={{ background: 'var(--red)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    Ver Mais Informações
                  </button>
                </>
              )}

              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', marginBottom: '24px', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    {pkg.desc}
                  </p>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(10px)', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Detalhes Inclusos</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li>• Evento principal: <b>{pkg.event_type}</b></li>
                      <li>• Serviço de Buffet: <b>{pkg.buffet}</b></li>
                      <li>• Espaço reservado exclusivo</li>
                      <li>• Atendimento preferencial</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setStep(2)}
                    className="btn-primary"
                    style={{ background: 'var(--red)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    Fazer Reserva / Orçamento
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="res-modal-form-area animate-in slide-in-from-right-8 fade-in duration-300" style={{ flex: '1', overflowY: 'auto', padding: '32px 40px', position: 'relative', background: 'var(--cream)', color: '#111' }}>
            <ReservationForm
              form={form}
              errors={errors}
              packages={packages}
              selectedPackage={selectedPackage}
              onFormChange={onFormChange}
              onSubmit={onSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
}
