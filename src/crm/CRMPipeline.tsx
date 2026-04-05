import { useState } from 'react';
import { Reservation, CRMStage } from '../types';
import CRMLeadModal from './CRMLeadModal';

interface CRMPipelineProps {
  leads: Reservation[];
  onUpdateStatus: (id: string, status: CRMStage) => void;
  // notes update directly not strictly needed here if we do it inside modal, but let's assume modal is self-contained state-wise or calls layout.
}

const STAGES: { id: CRMStage; label: string; width: string }[] = [
  { id: 'novo', label: 'Novo', width: '250px' },
  { id: 'em_contato', label: 'Em Contato', width: '250px' },
  { id: 'negociando', label: 'Negociando', width: '250px' },
  { id: 'fechado', label: 'Fechado', width: '200px' },
  { id: 'perdido', label: 'Perdido', width: '200px' },
];

export default function CRMPipeline({ leads, onUpdateStatus }: CRMPipelineProps) {
  const [selectedLead, setSelectedLead] = useState<Reservation | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent, targetStage: CRMStage) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      const lead = leads.find(l => l.id === leadId);
      if (lead && lead.status !== targetStage) {
        onUpdateStatus(leadId, targetStage);
      }
    }
  };

  return (
    <div className="crm-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="crm-dash-header">
        <h2 className="view-title">Pipeline</h2>
        <p className="view-sub">{leads.length} leads no total</p>
      </div>

      <div className="kanban-board" style={{ display: 'flex', gap: '16px', flex: 1, overflowX: 'auto', paddingBottom: '20px' }}>
        {STAGES.map((stage) => {
          const colLeads = leads.filter(l => l.status === stage.id);
          
          return (
            <div 
              key={stage.id} 
              className="kanban-col" 
              style={{ minWidth: stage.width, display: 'flex', flexDirection: 'column', gap: '12px', background: 'transparent', borderRadius: '8px', padding: '4px', transition: 'background 0.2s' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2A2A2A', paddingBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>{stage.label}</span>
                <span style={{ color: '#888', fontSize: '13px' }}>{colLeads.length}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                {colLeads.map(lead => (
                  <div 
                    key={lead.id} 
                    className="kanban-card" 
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id!)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedLead(lead)}
                    style={{ background: '#1A1A1A', padding: '16px', borderRadius: '8px', border: '1px solid #2A2A2A', cursor: 'grab', transition: 'border-color 0.2s, opacity 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#444'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#2A2A2A'}
                  >
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>{lead.name}</div>
                    
                    <div style={{ fontSize: '12px', color: '#888', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: '#FBBF24' }}>🍕 {lead.buffet}</span>
                      <span>📞 {lead.phone}</span>
                      <span>👥 {lead.guests} pessoas</span>
                      <span>📅 {new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedLead && (
        <CRMLeadModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={(id, status) => {
            onUpdateStatus(id, status);
            setSelectedLead(null); // Optional: close modal when status changes, like Trello.
          }}
          onUpdateNotes={() => {}} 
        />
      )}
    </div>
  );
}
