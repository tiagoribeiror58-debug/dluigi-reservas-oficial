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
          background: 'radial-gradient(circle at 50% 30%, #3D0808 0%, #110202 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="animate-spin-slow">
            <UtensilsCrossed size={400} color="#7A1515" strokeWidth={0.5} style={{ opacity: 0.15 }} />
          </div>
        </div>
      </div>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <span className="hero-tag animate-slide-up delay-100">Tradição & Excelência em Passos</span>
        <h1 className="animate-slide-up delay-200">
          Um lugar para
          <br />
          <em>celebrar a vida.</em>
        </h1>
        <p className="animate-slide-up delay-300">
          O cenário perfeito para seus momentos inesquecíveis. Alta gastronomia, sofisticação e conforto no melhor espaço de eventos da cidade.
        </p>
        <button className="btn-cta animate-slide-pulse delay-400" onClick={onCtaClick}>
          <span>Reservar Agora</span>
        </button>
      </div>
    </div>
  );
}
