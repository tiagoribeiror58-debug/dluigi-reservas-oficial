import React from 'react';
import { PartyPopper } from 'lucide-react';

interface SuccessScreenProps {
  onNewReservation: () => void;
}

export default function SuccessScreen({ onNewReservation }: SuccessScreenProps) {
  return (
    <div className="success-wrap">
      <div className="success-box">
        <div className="success-emoji" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <PartyPopper size={64} color="var(--red)" strokeWidth={1.5} />
        </div>
        <h2>Reserva solicitada!</h2>
        <p>Recebemos seu pedido. Nossa equipe confirmará em breve pelo WhatsApp.</p>
        <p className="success-phone">(35) 3521-8700</p>
        <button className="btn-outline" onClick={onNewReservation}>
          Nova reserva
        </button>
      </div>
    </div>
  );
}
