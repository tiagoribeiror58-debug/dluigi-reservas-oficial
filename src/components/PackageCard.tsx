import { Package } from '../types';
import * as Icons from 'lucide-react';

interface PackageCardProps {
  package: Package;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PackageCard({ package: pkg, isSelected, onSelect }: PackageCardProps) {
  return (
    <div
      className={`pkg-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ background: isSelected ? pkg.color : '#fff' }}
    >
      <div
        className="pkg-img-placeholder"
        style={{ background: `linear-gradient(135deg,${pkg.color},#e8d0be)` }}
      >
        {(() => {
          const Icon = (Icons as any)[pkg.iconName];
          return Icon ? <Icon size={40} strokeWidth={1.5} color="var(--red)" /> : null;
        })()}
      </div>
      <div className="pkg-body">
        <div className="pkg-title">{pkg.title}</div>
        <div className="pkg-desc">{pkg.desc}</div>
        <span className="pkg-tag">{pkg.tag}</span>
        <div className="pkg-sel-badge">✓ Selecionado — preencha abaixo</div>
      </div>
    </div>
  );
}
