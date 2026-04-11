import { Package } from '@/types/reservation';
import * as Icons from 'lucide-react';
import { Share2 } from 'lucide-react';

interface PackageCardProps {
  package: Package;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PackageCard({ package: pkg, isSelected, onSelect }: PackageCardProps) {
  const imageUrl = pkg.image_urls && pkg.image_urls.length > 0 ? pkg.image_urls[0] : null;

  // Monta a mensagem de compartilhamento no WhatsApp
  // encodeURIComponent = transforma texto em formato seguro para URL
  // (ex: "Olá!" vira "Ol%C3%A1%21")
  const handleShare = (e: React.MouseEvent) => {
    // stopPropagation: impede que o clique no botão "suba" para o card e abra o modal de reserva
    e.stopPropagation();

    const siteUrl = window.location.origin;
    
    const message = 
`👀 Olha essa oferta que vi na D'Luigi Pizzaria!

*${pkg.title}*
${pkg.desc}

${pkg.tag}${pkg.price ? ` · ${pkg.price}` : ''}

Reservas pelo link:
${siteUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className={`pkg-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ position: 'relative' }}
    >
      <div
        className="pkg-img-placeholder"
        style={{ 
          background: imageUrl 
             ? `url(${imageUrl})` 
             : `linear-gradient(135deg,${pkg.color},#e8d0be)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!imageUrl && (() => {
          const IconName = pkg.icon_name || 'Star';
          const Icon = (Icons as any)[IconName] || Icons.Star;
          return <Icon size={40} strokeWidth={1.5} color="var(--red)" />;
        })()}
      </div>
      <div className="pkg-body">
        <div className="pkg-title">{pkg.title}</div>
        <div className="pkg-desc">{pkg.desc}</div>
        <div className="flex items-center flex-wrap gap-2 mt-auto pt-2">
          <span className="pkg-tag">{pkg.tag}</span>
          {pkg.price && (
            <span className="pkg-price block text-[13px] font-bold text-[#7A1515] bg-[#7A1515]/10 px-2.5 py-1 rounded-full border border-[#7A1515]/20">
              {pkg.price}
            </span>
          )}
          {/* Botão de compartilhar via WhatsApp */}
          <button
            onClick={handleShare}
            title="Compartilhar esta oferta no WhatsApp"
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(37,211,102,0.25)',
              background: 'rgba(37,211,102,0.08)',
              color: '#25D366',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37,211,102,0.18)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(37,211,102,0.5)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37,211,102,0.08)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(37,211,102,0.25)';
            }}
          >
            <Share2 size={12} />
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}
