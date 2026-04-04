interface SuccessScreenProps {
  onNewReservation: () => void;
}

export default function SuccessScreen({ onNewReservation }: SuccessScreenProps) {
  return (
    <div className="success-wrap">
      <div className="success-box">
        <div className="success-emoji">🍕</div>
        <h2>Solicitação enviada!</h2>
        <p>Recebemos seu pedido. Nossa equipe confirmará em breve pelo WhatsApp.</p>
        <p className="success-phone">(35) 3521-8700</p>
        <button className="btn-outline" onClick={onNewReservation}>
          Nova reserva
        </button>
      </div>
    </div>
  );
}
