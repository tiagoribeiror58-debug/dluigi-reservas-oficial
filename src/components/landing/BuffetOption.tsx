import { BuffetOption as BuffetOptionType } from '@/types/reservation';

interface BuffetOptionProps {
  option: BuffetOptionType;
  isSelected: boolean;
  onSelect: () => void;
}

export default function BuffetOption({ option, isSelected, onSelect }: BuffetOptionProps) {
  return (
    <div
      className={`buffet-option ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="ol">{option.label}</div>
      <div className="od">{option.desc}</div>
    </div>
  );
}
