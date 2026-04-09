import { Package } from '@/types/reservation';
import PackageCard from './PackageCard';

interface PackagesSectionProps {
  packages: Package[];
  selectedPackage: string | null;
  onSelectPackage: (id: string) => void;
  title?: string;
  subtitle?: string;
}

export default function PackagesSection({ packages, selectedPackage, onSelectPackage, title = "Escolha o seu momento", subtitle = "Selecione um pacote para pré-preencher a reserva automaticamente" }: PackagesSectionProps) {
  return (
    <div className="section-packages">
      <h2 className="section-title">{title}</h2>
      <p className="section-sub">{subtitle}</p>
      <div className="packages-grid">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            isSelected={selectedPackage === pkg.id}
            onSelect={() => onSelectPackage(pkg.id)}
          />
        ))}
      </div>
    </div>
  );
}
