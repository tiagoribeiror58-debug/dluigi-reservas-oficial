interface HeaderProps {
  onReserveClick: () => void;
}

export default function Header({ onReserveClick }: HeaderProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex justify-center pointer-events-none">
      <img 
        src="/logo.jpg" 
        alt="D'Luigi Logo" 
        className="w-16 h-16 rounded-full object-cover shadow-lg pointer-events-auto transition-transform hover:scale-105"
      />
    </div>
  );
}
