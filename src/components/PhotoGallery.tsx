import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = [
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.12.49.jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.12.50.jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.13.09 (1).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.13.09.jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.13.10 (1).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.13.10.jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.13.51 (1).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.13.51 (2).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.13.51.jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.14.01 (1).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.14.01.jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.16.10 (1).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.16.10.jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.16.11 (1).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.16.11 (2).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.16.11 (3).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.16.11 (4).jpeg',
  '/imagens-dluigi/WhatsApp Image 2026-04-06 at 14.16.11.jpeg'
];

export default function PhotoGallery() {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex !== null) {
      setPreviewIndex(previewIndex === 0 ? PHOTOS.length - 1 : previewIndex - 1);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex !== null) {
      setPreviewIndex(previewIndex === PHOTOS.length - 1 ? 0 : previewIndex + 1);
    }
  };

  return (
    <section className="section-media" style={{ padding: '40px 16px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <h2 className="section-title text-center" style={{ fontSize: '28px' }}>Veja Como É</h2>
        <p className="section-sub text-center" style={{ fontSize: '15px' }}>
          Nosso ambiente real: clique na imagem para ampliar.
        </p>
      </div>
      
      {/* Scrollable Gallery */}
      <div 
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '16px',
          paddingBottom: '20px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
        }}
      >
        {PHOTOS.map((src, idx) => (
          <div 
            key={idx} 
            className="photo-card" 
            onClick={() => setPreviewIndex(idx)}
            style={{ 
              flex: '0 0 auto', 
              width: '80vw', 
              maxWidth: '320px', 
              height: '240px', 
              overflow: 'hidden', 
              cursor: 'pointer',
              scrollSnapAlign: 'center',
              borderRadius: '12px'
            }}
          >
            <img 
              src={src} 
              alt={`Ambiente D'Luigi ${idx + 1}`} 
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 300ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox / Preview */}
      {previewIndex !== null && (
        <div 
          onClick={() => setPreviewIndex(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <button 
            onClick={() => setPreviewIndex(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              zIndex: 10000
            }}
          >
            <X size={32} />
          </button>
          
          <button 
            onClick={prevImage}
            style={{
              position: 'absolute',
              left: '10px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              padding: '12px',
              zIndex: 10000
            }}
          >
            <ChevronLeft size={32} />
          </button>

          <img 
            src={PHOTOS[previewIndex]} 
            alt={`Preview ${previewIndex + 1}`}
            onClick={(e) => e.stopPropagation()} /* prevent closing when clicking on image */
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain'
            }}
          />

          <button 
            onClick={nextImage}
            style={{
              position: 'absolute',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              padding: '12px',
              zIndex: 10000
            }}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  );
}
