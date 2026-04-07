interface HeaderProps {
  onReserveClick: () => void;
}

export default function Header({ onReserveClick }: HeaderProps) {
  return (
    <div className="header">
      <div className="flex items-center gap-4">
        <img 
          src="/logo.jpg" 
          alt="D'Luigi Logo" 
          className="w-10 h-10 rounded-full object-cover shadow-sm"
        />
        <span className="logo hidden sm:inline-block">D'Luigi Pizzaria</span>
      </div>
      <div className="header-actions">
        <button className="btn-reservar-nav" onClick={onReserveClick}>
          Reservar
        </button>
      </div>
    </div>
  );
}
