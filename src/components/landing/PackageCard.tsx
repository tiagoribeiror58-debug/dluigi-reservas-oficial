import { Package } from '@/types/reservation';
import * as Icons from 'lucide-react';

interface PackageCardProps {
  package: Package;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PackageCard({ package: pkg, isSelected, onSelect }: PackageCardProps) {
  const imageUrl = pkg.image_urls && pkg.image_urls.length > 0 ? pkg.image_urls[0] : null;

  return (
    <div
      className={`pkg-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{
        position: 'relative'
      }}
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
        </div>
      </div>
    </div>
  );
}
