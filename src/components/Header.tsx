interface HeaderProps {
  onReserveClick: () => void;
}

export default function Header({ onReserveClick }: HeaderProps) {
  return (
    <div className="header shadow-sm !px-4 sm:!px-8">
      <div className="flex items-center gap-3">
        <img 
          src="/logo.jpg" 
          alt="D'Luigi Logo" 
          className="w-10 h-10 rounded-full object-cover shadow-sm border border-[var(--warm)]"
        />
        <span className="logo hidden sm:inline-block">D'Luigi Pizzaria</span>
      </div>
      <div className="header-actions">
        <button className="btn-reservar-nav" onClick={onReserveClick}>
          Reservar agora
        </button>
      </div>
    </div>
  );
}
