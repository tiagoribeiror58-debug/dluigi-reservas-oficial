import { useState } from 'react';
import { Reservation, CRMStage } from '../types';
import CRMLeadModal from './CRMLeadModal';
import { Search, Filter } from 'lucide-react';

interface CRMLeadsProps {
  leads: Reservation[];
  onUpdateStatus: (id: string, status: CRMStage) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function CRMLeads({ leads, onUpdateStatus, onUpdateNotes }: CRMLeadsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
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
          style={{ background: '#1A1A1A', color: '#FFF', border: '1px solid #2A2A2A', padding: '10px 16px', borderRadius: '8px', outline: 'none' }}
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
        
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="#888" style={{ position: 'absolute', left: '16px', top: '12px' }} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#FFF', padding: '10px 16px 10px 42px', borderRadius: '8px', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px', overflow: 'hidden', flex: 1 }}>
        <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ background: '#242424', position: 'sticky', top: 0 }}>
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
                  style={{ borderBottom: '1px solid #2A2A2A', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#2A2A2A'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px', color: '#FFF', fontWeight: 500 }}>{lead.name}</td>
                  <td style={{ padding: '16px', color: '#A0A0A0' }}>{lead.phone}</td>
                  <td style={{ padding: '16px', color: '#A0A0A0' }}>{new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '16px', color: '#A0A0A0' }}>{lead.buffet}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: getStatusColor(lead.status), border: `1px solid ${getStatusColor(lead.status)}40`, background: `${getStatusColor(lead.status)}10`, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <CRMLeadModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={onUpdateStatus}
          onUpdateNotes={onUpdateNotes}
        />
      )}
    </div>
  );
}
