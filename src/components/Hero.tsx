interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <div className="hero">
      <div
        className="hero-img"
        style={{
          background: 'linear-gradient(135deg,#3a0a0a,#7A1515)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '120px',
          opacity: '0.18',
        }}
      >
        🍕
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="hero-tag">Há mais de 15 anos em Passos/MG</span>
        <h1>
          Um lugar para
          <br />
          <em>celebrar de verdade</em>
        </h1>
        <p>
          Espaço completo para eventos sociais e corporativos. Boa pizza,
          ambiente acolhedor e um atendimento que valoriza cada detalhe.
        </p>
        <button className="btn-cta" onClick={onCtaClick}>
          Escolher um pacote ↓
        </button>
      </div>
    </div>
  );
}
