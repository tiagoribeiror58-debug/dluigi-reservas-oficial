import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { FilterType, Reservation, ReservationStatus } from '../types';
import { supabase } from '../supabase';
import ReservationCard from './ReservationCard';

interface AdminDashboardProps {
  session: Session | null;
}

export default function AdminDashboard({ session }: AdminDashboardProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:reservations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => {
          loadReservations(); // Refetch all logic (simple and safe for this volume)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      document.title = "D'Luigi Reservas"; // Reset title on unmount
    };
  }, []);

  useEffect(() => {
    // Update badge/title
    const pendingCount = reservations.filter(r => r.status === 'pendente').length;
    if (pendingCount > 0) {
      document.title = `(${pendingCount}) Novas Reservas - Admin`;
    } else {
      document.title = `Admin - D'Luigi`;
    }
  }, [reservations]);

  const loadReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*');

    if (error) {
      console.error('Error loading reservations:', error);
    } else {
      const sorted = (data as Reservation[]).sort((a, b) => {
        // Pending first
        if (a.status === 'pendente' && b.status !== 'pendente') return -1;
        if (a.status !== 'pendente' && b.status === 'pendente') return 1;
        // Then by date
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      setReservations(sorted || []);
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
    }
  };

  const handleUpdateAdminNote = async (id: string, admin_notes: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ admin_notes, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating admin note:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Certeza que deseja escluir esta reserva permanentemente? Esta ação não pode ser desfeita.")) {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);
      
      if (error) {
        alert("Erro ao excluir. Tente novamente.");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const counts = {
    pendente: reservations.filter((r) => r.status === 'pendente').length,
    confirmada: reservations.filter((r) => r.status === 'confirmada').length,
    cancelada: reservations.filter((r) => r.status === 'cancelada').length,
  };

  let displayReservations = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter);
  
  if (searchTerm.trim() !== '') {
    const s = searchTerm.toLowerCase();
    displayReservations = displayReservations.filter((r) => 
      r.name.toLowerCase().includes(s) || r.phone.includes(s)
    );
  }

  return (
    <div className="admin-wrap">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', fontWeight: 700, color: 'var(--red)' }}>
          Reservas
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {session?.user?.email && (
            <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'none' }} className="sm-show">
              {session.user.email}
            </span>
          )}
          <button onClick={handleLogout} className="btn-logout">Sair</button>
          <span style={{ fontSize: '13px', color: '#B8A89A' }}>{reservations.length} total</span>
        </div>
      </div>
      
      <div className="admin-controls">
        <input 
          type="text" 
          placeholder="Buscar cliente ou telefone..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Todas ({reservations.length})
          </button>
          <button className={`filter-btn ${filter === 'pendente' ? 'active' : ''}`} onClick={() => setFilter('pendente')}>
            Pendentes ({counts.pendente})
          </button>
          <button className={`filter-btn ${filter === 'confirmada' ? 'active' : ''}`} onClick={() => setFilter('confirmada')}>
            Confirmadas ({counts.confirmada})
          </button>
          <button className={`filter-btn ${filter === 'cancelada' ? 'active' : ''}`} onClick={() => setFilter('cancelada')}>
            Canceladas ({counts.cancelada})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Carregando dados vivos...</div>
      ) : displayReservations.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? "Nenhuma reserva encontrada para a busca." : "Nenhuma reserva encontrada."}
        </div>
      ) : (
        displayReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation as Reservation & { id: string; created_at: string }}
            onUpdateStatus={handleUpdateStatus}
            onUpdateAdminNote={handleUpdateAdminNote}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
