import { useState } from 'react';
import { Package, Reservation, CRMStage } from '@/types/reservation';
import CRMLeadModal from './CRMLeadModal';
import { Search, Gift } from 'lucide-react';

interface CRMLeadsProps {
  leads: Reservation[];
  packages: Package[];
  onUpdateStatus: (id: string, status: CRMStage) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function CRMLeads({ leads, packages, onUpdateStatus, onUpdateNotes }: CRMLeadsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [datePreset, setDatePreset] = useState('Todos');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [selectedLead, setSelectedLead] = useState<Reservation | null>(null);

  // Filter Logic
  let display = leads;
  if (statusFilter !== 'Todos') {
    display = display.filter(l => l.status === statusFilter);
  }
  if (searchTerm.trim()) {
    const s = searchTerm.toLowerCase();
    display = display.filter(l => l.name.toLowerCase().includes(s) || l.phone.includes(s));
  }
  let filterStart = '';
  let filterEnd = '';
  
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (datePreset === 'Hoje') {
    filterStart = todayStr;
    filterEnd = todayStr;
  } else if (datePreset === 'Amanhã') {
    const tmr = new Date(today);
    tmr.setDate(today.getDate() + 1);
    filterStart = `${tmr.getFullYear()}-${String(tmr.getMonth() + 1).padStart(2, '0')}-${String(tmr.getDate()).padStart(2, '0')}`;
    filterEnd = filterStart;
  } else if (datePreset === 'Proximos7') {
    filterStart = todayStr;
    const next7 = new Date(today);
    next7.setDate(today.getDate() + 7);
    filterEnd = `${next7.getFullYear()}-${String(next7.getMonth() + 1).padStart(2, '0')}-${String(next7.getDate()).padStart(2, '0')}`;
  } else if (datePreset === 'EsteMes') {
    const lastDay = new Date(yyyy, today.getMonth() + 1, 0).getDate();
    filterStart = `${yyyy}-${mm}-01`;
    filterEnd = `${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`;
  } else if (datePreset === 'Personalizado') {
    filterStart = dateStart;
    filterEnd = dateEnd;
  }

  if (filterStart) {
    display = display.filter(l => l.date >= filterStart);
  }
  if (filterEnd) {
    display = display.filter(l => l.date <= filterEnd);
  }

  const getStatusColor = (st?: string) => {
    switch(st) {
      case 'novo': return '#FBBF24'; // yellow
      case 'em_contato': return '#60A5FA'; // blue
      case 'negociando': return '#F97316'; // orange
      case 'fechado': return '#10B981'; // green
      case 'perdido': return '#EF4444'; // red
      default: return '#888';
    }
  };

  const getStatusLabel = (st?: string) => {
    switch(st) {
      case 'novo': return 'Novo';
      case 'em_contato': return 'Em Contato';
      case 'negociando': return 'Negociando';
      case 'fechado': return 'Fechado';
      case 'perdido': return 'Perdido';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="crm-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="crm-dash-header" style={{ marginBottom: '24px' }}>
        <h2 className="view-title">Leads</h2>
        <p className="view-sub">{leads.length} leads cadastrados</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <select 
          style={{ background: '#0C0C0C', color: '#FFF', border: '1px solid #222', padding: '10px 16px', borderRadius: '8px', outline: 'none', fontFamily: 'Inter', fontSize: '14px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Todos">Todos Status</option>
          <option value="novo">Novo</option>
          <option value="em_contato">Em Contato</option>
          <option value="negociando">Negociando</option>
          <option value="fechado">Fechado</option>
          <option value="perdido">Perdido</option>
        </select>
        
        <select 
          value={datePreset}
          onChange={(e) => setDatePreset(e.target.value)}
          style={{ background: '#0C0C0C', color: '#FFF', border: '1px solid #222', padding: '10px 16px', borderRadius: '8px', outline: 'none', fontFamily: 'Inter', fontSize: '14px' }}
        >
          <option value="Todos">📅 Qualquer Data</option>
          <option value="Hoje">Hoje</option>
          <option value="Amanhã">Amanhã</option>
          <option value="Proximos7">Próximos 7 dias</option>
          <option value="EsteMes">Este Mês</option>
          <option value="Personalizado">Personalizado...</option>
        </select>

        {datePreset === 'Personalizado' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="date" 
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              style={{ background: '#0C0C0C', color: '#FFF', border: '1px solid #222', padding: '10px 12px', borderRadius: '8px', outline: 'none', fontFamily: 'Inter', fontSize: '13px', colorScheme: 'dark' }}
              title="Data inicial"
            />
            <span style={{ color: '#888', fontSize: '13px' }}>até</span>
            <input 
              type="date" 
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              style={{ background: '#0C0C0C', color: '#FFF', border: '1px solid #222', padding: '10px 12px', borderRadius: '8px', outline: 'none', fontFamily: 'Inter', fontSize: '13px', colorScheme: 'dark' }}
              title="Data final"
            />
          </div>
        )}

        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="#888" style={{ position: 'absolute', left: '16px', top: '12px' }} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: '#0C0C0C', border: '1px solid #222', color: '#FFF', padding: '10px 16px 10px 42px', borderRadius: '8px', outline: 'none', fontFamily: 'Inter', fontSize: '14px' }}
          />
        </div>
      </div>

      <div style={{ background: '#0C0C0C', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden', flex: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ background: '#101010', position: 'sticky', top: 0, borderBottom: '1px solid #222' }}>
              <tr>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Nome</th>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Telefone</th>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Data Evento</th>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Cardápio</th>
                <th style={{ padding: '16px', color: '#888', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {display.map(lead => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  style={{ borderBottom: '1px solid #1A1A1A', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#141414'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px', color: '#FFF', fontWeight: 500 }}>{lead.name}</td>
                  <td style={{ padding: '16px', color: '#A0A0A0' }}>{lead.phone}</td>
                  <td style={{ padding: '16px', color: '#A0A0A0' }}>{new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '16px', color: '#A0A0A0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span>{lead.buffet}</span>
                      {lead.package_id && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#FF5A5A', fontWeight: 600 }}><Gift size={12}/> {packages.find(p => p.id === lead.package_id)?.title || 'Pacote'}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: getStatusColor(lead.status), border: `1px solid ${getStatusColor(lead.status)}40`, background: `${getStatusColor(lead.status)}10`, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {display.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    Nenhuma reserva encontrada para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <CRMLeadModal 
          lead={selectedLead} 
          packages={packages}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={onUpdateStatus}
          onUpdateNotes={onUpdateNotes}
        />
      )}
    </div>
  );
}
