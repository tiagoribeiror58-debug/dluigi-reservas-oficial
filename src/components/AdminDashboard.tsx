import { useState, useEffect } from 'react';
import { FilterType, ReservationStatus } from '../types';
import { supabase } from '../supabase';
import ReservationCard from './ReservationCard';

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error loading reservations:', error);
    } else {
      setReservations(data || []);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: ReservationStatus) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating reservation:', error);
      alert('Erro ao atualizar reserva');
      return;
    }

    setReservations(
      reservations.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const counts = {
    pendente: reservations.filter((r) => r.status === 'pendente').length,
    confirmada: reservations.filter((r) => r.status === 'confirmada').length,
    cancelada: reservations.filter((r) => r.status === 'cancelada').length,
  };

  const filteredReservations =
    filter === 'all'
      ? reservations
      : reservations.filter((r) => r.status === filter);

  return (
    <div className="admin-wrap">
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--red)',
          }}
        >
          Reservas
        </h2>
        <span style={{ fontSize: '13px', color: '#B8A89A' }}>{reservations.length} total</span>
      </div>
      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({reservations.length})
        </button>
        <button
          className={`filter-btn ${filter === 'pendente' ? 'active' : ''}`}
          onClick={() => setFilter('pendente')}
        >
          Pendentes ({counts.pendente})
        </button>
        <button
          className={`filter-btn ${filter === 'confirmada' ? 'active' : ''}`}
          onClick={() => setFilter('confirmada')}
        >
          Confirmadas ({counts.confirmada})
        </button>
        <button
          className={`filter-btn ${filter === 'cancelada' ? 'active' : ''}`}
          onClick={() => setFilter('cancelada')}
        >
          Canceladas ({counts.cancelada})
        </button>
      </div>
      {loading ? (
        <div className="empty-state">Carregando...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="empty-state">Nenhuma reserva ainda.</div>
      ) : (
        filteredReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onUpdateStatus={handleUpdateStatus}
          />
        ))
      )}
    </div>
  );
}
