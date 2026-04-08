import React, { useState, useEffect } from 'react';
import { Package, Reservation, FormErrors } from '@/types/reservation';
import ReservationForm from './ReservationForm';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen) setImgIndex(0);
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
          maxWidth: pkg ? '1000px' : '650px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          boxShadow: '0 40px 60px rgba(0,0,0,0.4)',
          position: 'relative',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            color: 'var(--txt-main)',
          }}
        >
          <X size={20} />
        </button>

        {pkg && (
          <div className="res-modal-pkg-info" style={{
            flex: '1',
            background: currentImage 
              ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url(${currentImage})` 
              : `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.85))`,
            backgroundColor: pkg.color,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            color: '#FFF',
            borderRight: '1px solid rgba(0,0,0,0.3)',
            minHeight: '400px',
            position: 'relative'
          }}>
            {images && images.length > 1 && (
              <>
                <button onClick={handlePrev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNext} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                  <ChevronRight size={20} />
                </button>
                <div style={{ position: 'absolute', bottom: 16, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 6 }}>
                  {images.map((_, i) => (
                    <div key={i} style={{ width: i === imgIndex ? 20 : 6, height: 6, borderRadius: 3, background: i === imgIndex ? 'var(--red)' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s' }} />
                  ))}
                </div>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ 
                background: 'var(--red)', color: '#FFF', padding: '6px 14px', 
                borderRadius: '20px', fontSize: '12px', fontWeight: 700
              }}>
                {pkg.tag}
              </span>
              {pkg.price && (
                <span style={{ 
                  background: 'rgba(255,255,255,0.15)', color: '#FFF', padding: '6px 14px', 
                  borderRadius: '20px', fontSize: '13px', fontWeight: 700, backdropFilter: 'blur(4px)'
                }}>
                  {pkg.price}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '32px', fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>{pkg.title}</h3>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>
              {pkg.desc}
            </p>
          </div>
        )}

        <div className="res-modal-form-area dark-premium" style={{ flex: '1', overflowY: 'auto', padding: '40px', position: 'relative', background: '#180505', color: '#FFF' }}>
          {/* We embed the ReservationForm directly, but we will hide some parts via CSS or adjust it */}
          <ReservationForm
            form={form}
            errors={errors}
            packages={packages}
            selectedPackage={selectedPackage}
            onFormChange={onFormChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
