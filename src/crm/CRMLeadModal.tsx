import { useState, useEffect } from 'react';
import { Reservation, CRMStage } from '../types';
import { formatWhatsAppNumber } from '../utils';
import { X, Copy, MessageCircle } from 'lucide-react';

interface CRMLeadModalProps {
  lead: Reservation;
  onClose: () => void;
  onUpdateStatus: (id: string, status: CRMStage) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function CRMLeadModal({ lead, onClose, onUpdateStatus, onUpdateNotes }: CRMLeadModalProps) {
  const [activeTab, setActiveTab] = useState<'mensagens' | 'notas'>('mensagens');
  const [notes, setNotes] = useState(lead.admin_notes || '');
  const [message, setMessage] = useState('');
  
  const wa = formatWhatsAppNumber(lead.phone);

  const getTemplate = (typ: string) => {
    switch(typ) {
      case 'contato1': return `Olá ${lead.name.split(' ')[0]}! 👋\n\nAqui é do D'Luigi Reservas.\nVi que você demonstrou interesse em reservar uma data conosco para ${lead.guests} pessoas!\n\nPosso te ajudar com mais informações sobre os nossos cardápios, pacotes ou confirmar sua reserva?\n\nAguardo seu retorno! 🍕`;
      case 'followup': return `${lead.name.split(' ')[0]}, tudo bem?\n\nPassando para perguntar se ficou alguma dúvida sobre o pacote de ${lead.buffet} que você escolheu.\n\nPodemos confirmar sua reserva para o dia ${new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')}? Nossa agenda está enchendo rápido!`;
      case 'proposta': return `Aqui estão os detalhes da proposta para o seu evento:\n\n- Data: ${new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')} às ${lead.time}\n- Pessoas: ${lead.guests}\n- Cardápio: ${lead.buffet}\n\nLembrando que o espaço fica garantido mediantes a taxa de confirmação.\nO que acha?`;
      case 'fechamento': return `✅ Reserva Confirmada, ${lead.name.split(' ')[0]}!\n\nEstá tudo certo para o dia ${new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')} às ${lead.time}.\n\nEstamos ansiosos para recebê-los!\nQualquer imprevisto, é só nos avisar por aqui.`;
      default: return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    const link = `https://wa.me/${wa}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');
  };

  const handleSaveNotes = () => {
    if (notes !== lead.admin_notes) {
      onUpdateNotes(lead.id!, notes);
    }
  };

  return (
    <div className="crm-modal-overlay">
      <div className="crm-modal">
        <div className="crm-modal-header">
          <div>
            <h2 style={{ fontSize: '20px', color: '#FFF' }}>{lead.name}</h2>
            <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '13px', color: '#888' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageCircle size={14}/> {lead.phone}</span>
              <span>📅 {new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')} às {lead.time}</span>
              <span>👥 {lead.guests} pax</span>
              <span>🍕 {lead.buffet}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div className="crm-modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>Mudar status:</span>
            <select 
              value={lead.status} 
              onChange={(e) => onUpdateStatus(lead.id!, e.target.value as CRMStage)}
              style={{ background: '#121212', color: '#FFF', border: '1px solid #2A2A2A', padding: '8px 12px', borderRadius: '6px', outline: 'none' }}
            >
              <option value="novo">Novo</option>
              <option value="em_contato">Em Contato</option>
              <option value="negociando">Negociando</option>
              <option value="fechado">Fechado</option>
              <option value="perdido">Perdido</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #2A2A2A', marginBottom: '20px' }}>
            <button className={`tab-btn ${activeTab === 'mensagens' ? 'active' : ''}`} onClick={() => setActiveTab('mensagens')}>Mensagens</button>
            <button className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`} onClick={() => setActiveTab('notas')}>Notas / Contexto</button>
          </div>

          {activeTab === 'mensagens' && (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button className="template-btn" onClick={() => setMessage(getTemplate('contato1'))}>Primeiro Contato</button>
                <button className="template-btn" onClick={() => setMessage(getTemplate('followup'))}>Follow-up</button>
                <button className="template-btn" onClick={() => setMessage(getTemplate('proposta'))}>Envio de Proposta</button>
                <button className="template-btn" onClick={() => setMessage(getTemplate('fechamento'))}>Fechamento</button>
              </div>

              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Selecione um template acima ou digite sua mensagem..."
                style={{ width: '100%', height: '180px', background: '#121212', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '16px', color: '#FFF', resize: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '14px' }}
              />

              <button 
                onClick={handleCopy}
                disabled={!message}
                style={{ width: '100%', padding: '14px', background: '#FBBF24', color: '#1A0A0A', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: message ? 'pointer' : 'not-allowed', marginTop: '16px', opacity: message ? 1 : 0.5 }}
              >
                <Copy size={18} /> Copiar e Abrir WhatsApp
              </button>
            </div>
          )}

          {activeTab === 'notas' && (
            <div>
              {lead.notes && (
                <div style={{ background: '#121212', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '3px solid #8B0000' }}>
                  <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Cliente escreveu na reserva:</span>
                  <p style={{ color: '#E0E0E0', fontSize: '14px', fontStyle: 'italic' }}>"{lead.notes}"</p>
                </div>
              )}
              
              <span style={{ fontSize: '12px', color: '#888', marginBottom: '8px', display: 'block' }}>Anotações Administrativas (Salva automaticamente ao sair do campo)</span>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleSaveNotes}
                placeholder="Exemplo: Cliente pediu para juntar mesas..."
                style={{ width: '100%', height: '180px', background: '#121212', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '16px', color: '#FFF', resize: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '14px' }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
