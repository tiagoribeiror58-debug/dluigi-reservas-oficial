import { UtensilsCrossed } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <div className="hero">
      <div
        className="hero-img"
        style={{
          background: 'radial-gradient(circle at top right, #4a0f0f 0%, #1a0a0a 60%, #0a0404 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <UtensilsCrossed size={400} color="#7A1515" strokeWidth={0.5} style={{ opacity: 0.2, transform: 'rotate(-10deg) translate(20px, -20px)' }} />
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
