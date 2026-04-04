import { Reservation, ReservationStatus } from '../types';
import { BUFFETS, PACKAGES } from '../constants';
import { formatDate } from '../utils';

interface ReservationCardProps {
  reservation: Reservation & { id: string; created_at: string };
  onUpdateStatus: (id: string, status: ReservationStatus) => void;
}

const STATUS_CONFIG = {
  pendente: { label: 'Pendente', cls: 's-pendente' },
  confirmada: { label: 'Confirmada', cls: 's-confirmada' },
  cancelada: { label: 'Cancelada', cls: 's-cancelada' },
};

export default function ReservationCard({ reservation, onUpdateStatus }: ReservationCardProps) {
  const status = STATUS_CONFIG[reservation.status as ReservationStatus];
  const buffetLabel = BUFFETS.find((b) => b.value === reservation.buffet)?.label || reservation.buffet;
  const dateStr = formatDate(reservation.date);
  const pkg = PACKAGES.find((p) => p.id === reservation.package_id);
  const createdAt = new Date(reservation.created_at).toLocaleString('pt-BR');

  return (
    <div className="res-card">
      <div className="res-top">
        <div>
          <span className="res-name">{reservation.name}</span>
          <span className="res-phone">{reservation.phone}</span>
        </div>
        <span className={`stag ${status.cls}`}>{status.label}</span>
      </div>
      {pkg && (
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
          {pkg.emoji} {pkg.title}
        </div>
      )}
      <div className="res-grid">
        <div>
          <span>Data </span>
          {dateStr} · {reservation.time}
        </div>
        <div>
          <span>Pessoas </span>
          {reservation.guests}
        </div>
        <div>
          <span>Período </span>
          {reservation.period || '—'}
        </div>
        <div>
          <span>Evento </span>
          {reservation.eventType}
        </div>
        <div style={{ gridColumn: '2/4' }}>
          <span>Cardápio </span>
          {buffetLabel}
        </div>
      </div>
      {reservation.birthday && (
        <p style={{ fontSize: '12px', color: 'var(--red)', fontWeight: 600, marginBottom: '8px' }}>
          🎂 Aniversariante presente
        </p>
      )}
      {reservation.notes && (
        <p style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '10px' }}>
          "{reservation.notes}"
        </p>
      )}
      {reservation.status === 'pendente' && (
        <div className="res-actions">
          <button className="btn-ok" onClick={() => onUpdateStatus(reservation.id, 'confirmada')}>
            ✓ Confirmar
          </button>
          <button className="btn-no" onClick={() => onUpdateStatus(reservation.id, 'cancelada')}>
            ✕ Cancelar
          </button>
        </div>
      )}
      <p className="res-ts">Solicitado em {createdAt}</p>
    </div>
  );
}
