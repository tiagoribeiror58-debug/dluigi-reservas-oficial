import { Reservation } from '@/types/reservation';
import { Users, UserPlus, Handshake, Trophy } from 'lucide-react';

export default function CRMDashboard({ leads, loading }: { leads: Reservation[], loading: boolean }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #333', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '14px', fontWeight: 500 }}>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const total = leads.length;
  // Let's assume 'novo' as leads added recently.
  const novos = leads.filter(l => l.status === 'novo').length;
  const negociando = leads.filter(l => l.status === 'em_contato' || l.status === 'negociando').length;
  const fechados = leads.filter(l => l.status === 'fechado').length;
  
  const conversionRate = total > 0 ? ((fechados / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="crm-fade-in">
      <div className="crm-dash-header">
        <h2 className="view-title">Dashboard</h2>
        <p className="view-sub">Visão geral dos seus leads</p>
      </div>

      <div className="crm-stats-grid">
        <div className="stat-card">
          <div>
            <div style={{ color: '#888', fontSize: '13px' }}>Total de Leads</div>
            <div className="stat-val">{total}</div>
          </div>
          <Users color="#60A5FA" size={28} />
        </div>
        
        <div className="stat-card">
          <div>
            <div style={{ color: '#888', fontSize: '13px' }}>Novos (Aguardando)</div>
            <div className="stat-val">{novos}</div>
          </div>
          <UserPlus color="#FBBF24" size={28} />
        </div>
        
        <div className="stat-card">
          <div>
            <div style={{ color: '#888', fontSize: '13px' }}>Em Negociação</div>
            <div className="stat-val">{negociando}</div>
          </div>
          <Handshake color="#F97316" size={28} />
        </div>
        
        <div className="stat-card" style={{ borderColor: '#8B0000' }}>
          <div>
            <div style={{ color: '#888', fontSize: '13px' }}>Convertidos</div>
            <div className="stat-val" style={{ color: '#F87171' }}>{fechados} <span style={{ fontSize: '16px', color: '#888', fontWeight: 'normal' }}>({conversionRate}%)</span></div>
          </div>
          <Trophy color="#F87171" size={28} />
        </div>
      </div>

      <div style={{ background: '#0C0C0C', border: '1px solid #222', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Leads por Status</h3>
        <div style={{ display: 'flex', gap: '16px', height: '200px', alignItems: 'flex-end', paddingTop: '20px' }}>
          {[
            { label: 'Novo', val: novos, color: '#FBBF24' },
            { label: 'Contato', val: leads.filter(l => l.status === 'em_contato').length, color: '#60A5FA' },
            { label: 'Negociando', val: leads.filter(l => l.status === 'negociando').length, color: '#F97316' },
            { label: 'Fechado', val: fechados, color: '#F87171' },
            { label: 'Perdido', val: leads.filter(l => l.status === 'perdido').length, color: '#4B5563' }
          ].map(col => {
            const heightPct = total > 0 ? (col.val / total) * 100 : 0;
            return (
              <div key={col.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>{col.val}</span>
                <div style={{ width: '100%', maxWidth: '60px', height: `${Math.max(2, heightPct)}%`, background: col.color, borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
                <span style={{ fontSize: '11px', color: '#888' }}>{col.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
