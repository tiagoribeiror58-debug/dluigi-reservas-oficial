

// Atualmente, não temos imagens válidas na pasta. O arquivo imagens-avaliações-dluigi está vazio (0 bytes).
// Para testar o visual, adicionamos espaços reservados ou você pode substituir essas urls pelas corretas mais tarde.
const REVIEW_IMAGES = [
  '',
  '',
  '',
];

export default function GoogleReviewsSection() {
  return (
    <section className="section-media" style={{ paddingBottom: '20px' }}>
      <div className="section-header">
        <h2 className="section-title text-center">O que dizem sobre nós</h2>
        <p className="section-sub text-center">Veja as avaliações dos clientes que já celebraram conosco.</p>
      </div>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', padding: '8px 0', scrollSnapType: 'x mandatory' }}>
        {REVIEW_IMAGES.map((src, idx) => (
          <div 
            key={idx} 
            style={{
              flex: '0 0 auto',
              width: '300px', // width for mobile 1, desktop handles differently if responsive CSS is applied
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              border: '1.5px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '150px',
              scrollSnapAlign: 'center',
            }}
          >
            {src ? (
              <img src={src} alt="Avaliação" style={{ width: '100%', borderRadius: '8px' }} loading="lazy" />
            ) : (
              <div style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center' }}>
                <p>Imagem de avaliação indisponível.</p>
                <p style={{ fontSize: '10px' }}>(Adicione as imagens em 'public/imagens-avaliações-dluigi')</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <a 
          href="https://share.google/Ad4BjYviXDuN000cr" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            border: '2px solid var(--red)',
            color: 'var(--red)',
            padding: '12px 24px',
            borderRadius: '30px',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: "'Inter', sans-serif",
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--red)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--red)';
          }}
        >
          Ver todas as avaliações no Google
        </a>
      </div>
    </section>
  );
}
