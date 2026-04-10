import { useState } from 'react';
import { Reservation, ReservationStatus } from '@/types/reservation';
import { BUFFETS, PACKAGES } from '@/lib/constants';
import { formatDate, daysUntil, formatWhatsAppNumber } from '@/lib/utils';
import { MessageCircle, Trash2 } from 'lucide-react';

interface ReservationCardProps {
  reservation: Reservation & { id: string; created_at: string };
  onUpdateStatus: (id: string, status: ReservationStatus) => void;
  onUpdateAdminNote: (id: string, note: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_CONFIG = {
  pendente: { label: 'Pendente', cls: 's-pendente' },
  confirmada: { label: 'Confirmada', cls: 's-confirmada' },
  cancelada: { label: 'Cancelada', cls: 's-cancelada' },
};

export default function ReservationCard({ reservation, onUpdateStatus, onUpdateAdminNote, onDelete }: ReservationCardProps) {
  const [note, setNote] = useState(reservation.admin_notes || '');
  
  const status = STATUS_CONFIG[reservation.status as ReservationStatus];
  const buffetLabel = BUFFETS.find((b) => b.value === reservation.buffet)?.label || reservation.buffet;
  const dateStr = formatDate(reservation.date);
  const pkg = PACKAGES.find((p) => p.id === reservation.package_id);
  const createdAt = new Date(reservation.created_at).toLocaleString('pt-BR');
  
  const diffDays = daysUntil(reservation.date);
  const isUpcoming = reservation.status === 'confirmada' && diffDays >= 0 && diffDays <= 3;
  const waNumber = formatWhatsAppNumber(reservation.phone);

  const handleBlurNote = () => {
    if (note !== reservation.admin_notes) {
      onUpdateAdminNote(reservation.id, note);
    }
  };

  return (
    <div className="res-card">
      <div className="res-top">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="res-name">{reservation.name}</span>
            <span className="res-phone">{reservation.phone}</span>
            
            <a 
              href={`https://wa.me/${waNumber}`} 
              target="_blank" 
              rel="noreferrer"
              className="wa-btn"
              title="Abrir no WhatsApp"
            >
              <MessageCircle size={14} /> Chamar
            </a>

            {isUpcoming && (
               <span className="stag s-upcoming">⚠️ Em {diffDays === 0 ? 'hoje' : diffDays === 1 ? '1 dia' : diffDays + ' dias'}</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`stag ${status.cls}`}>{status.label}</span>
          <button className="del-btn" onClick={() => onDelete(reservation.id)} title="Excluir reserva">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {pkg && (
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
          {pkg.title}
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
          Aniversariante presente
        </p>
      )}

      {reservation.notes && (
        <p style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '10px' }}>
          Observação do cliente: "{reservation.notes}"
        </p>
      )}

      <div className="admin-note-box">
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#A08F83', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Notas Internas (Admin)</span>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleBlurNote}
          placeholder="Ex: Mesas separadas, desconto 10%..."
          className="admin-note-input"
          rows={2}
        />
      </div>

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
