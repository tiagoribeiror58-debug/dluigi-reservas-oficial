import { Package } from '../types';

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
        {pkg.emoji}
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
