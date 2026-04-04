interface HeaderProps {
  onAdminClick: () => void;
  onReserveClick: () => void;
}

export default function Header({ onAdminClick, onReserveClick }: HeaderProps) {
  return (
    <div className="header">
      <span className="logo">D'Luigi Pizzaria</span>
      <div className="header-actions">
        <button className="nav-link" onClick={onAdminClick}>
          Área restrita
        </button>
        <button className="btn-reservar-nav" onClick={onReserveClick}>
          Reservar agora
        </button>
      </div>
    </div>
  );
}
