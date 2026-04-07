import { UtensilsCrossed } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <div className="hero">
      <div className="hero-img">
        {/* Usando uma imagem de background real se houver, ou um gradient sutil de alta qualidade.
            Por enquanto vamos manter o gradient com o Utensils */}
        <div style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(circle at 50% 30%, #4a0f0f 0%, #1a0a0a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <UtensilsCrossed size={400} color="#7A1515" strokeWidth={0.5} style={{ opacity: 0.15 }} />
        </div>
      </div>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <span className="hero-tag">Tradição & Excelência em Passos</span>
        <h1>
          Um lugar para
          <br />
          <em>celebrar a vida.</em>
        </h1>
        <p>
          O cenário perfeito para seus momentos inesquecíveis. Alta gastronomia, sofisticação e conforto no melhor espaço de eventos da cidade.
        </p>
        <button className="btn-cta" onClick={onCtaClick}>
          <span>Reservar Agora</span>
        </button>
      </div>
    </div>
  );
}
