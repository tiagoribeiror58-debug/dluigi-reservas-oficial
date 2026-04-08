import { useState, useEffect } from 'react';
import { Package, Reservation, CRMStage } from '@/types/reservation';
import { formatWhatsAppNumber } from '@/lib/utils';
import { X, Copy, MessageCircle, Calendar, Users, Pizza, Gift, Inbox, FileText, Save, Check } from 'lucide-react';

interface CRMLeadModalProps {
  lead: Reservation;
  packages: Package[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: CRMStage) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function CRMLeadModal({ lead, packages, onClose, onUpdateStatus, onUpdateNotes }: CRMLeadModalProps) {
  const [activeTab, setActiveTab] = useState<'mensagens' | 'notas'>('mensagens');
  const [notes, setNotes] = useState(lead.admin_notes || '');
  const [message, setMessage] = useState('');
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [copyPhoneIndicator, setCopyPhoneIndicator] = useState(false);
  
  const wa = formatWhatsAppNumber(lead.phone);
  const pkg = packages.find((p: Package) => p.id === lead.package_id);

  const getTemplate = (typ: string) => {
    switch(typ) {
      case 'contato1': return `Olá ${lead.name.split(' ')[0]}! 👋\n\nAqui é do D'Luigi Reservas.\nVi que você demonstrou interesse em reservar uma data conosco para ${lead.guests} pessoas!\n\nPosso te ajudar com mais informações sobre os nossos cardápios, pacotes ou confirmar sua reserva?\n\nAguardo seu retorno! 🍕`;
      case 'followup': return `${lead.name.split(' ')[0]}, tudo bem?\n\nPassando para perguntar se ficou alguma dúvida sobre o pacote de ${lead.buffet} que você escolheu.\n\nPodemos confirmar sua reserva para o dia ${new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')}? Nossa agenda está enchendo rápido!`;
      case 'proposta': return `Aqui estão os detalhes da proposta para o seu evento:\n\n- Data: ${new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')} às ${lead.time}\n- Pessoas: ${lead.guests}\n- Cardápio: ${lead.buffet}\n\nLembrando que o espaço fica garantido mediantes a taxa de confirmação.\nO que acha?`;
      case 'fechamento': return `✅ Reserva Confirmada, ${lead.name.split(' ')[0]}!\n\nEstá tudo certo para o dia ${new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')} às ${lead.time}.\n\nEstamos ansiosos para recebê-los!\nQualquer imprevisto, é só nos avisar por aqui.`;
      default: return '';
    }
  };

  const copyPhoneOnly = () => {
    navigator.clipboard.writeText(lead.phone);
    setCopyPhoneIndicator(true);
    setTimeout(() => setCopyPhoneIndicator(false), 2000);
  };

  const handleCopyTextOnly = () => {
    navigator.clipboard.writeText(message);
    alert('Mensagem copiada para a área de transferência!');
  };

  const handleOpenWA = () => {
    navigator.clipboard.writeText(message);
    const link = `https://wa.me/${wa}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');
  };

  const handleSaveNotes = () => {
    if (notes !== lead.admin_notes) {
      onUpdateNotes(lead.id!, notes);
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 2000);
    }
  };

  return (
    <div className="crm-modal-overlay">
      <div className="crm-modal">
        <div className="crm-modal-header" style={{ padding: '24px 24px 16px 24px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {lead.name}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', fontSize: '13px', color: '#A0A0A0' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#141414', padding: '6px 12px', borderRadius: '6px', border: '1px solid #222' }}>
                <MessageCircle size={16} color="#60A5FA" /> 
                <span>{lead.phone}</span>
                <button 
                  onClick={copyPhoneOnly}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#FBBF24', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}
                  title="Copiar número para Desktop WhatsApp"
                >
                  <Copy size={12} /> {copyPhoneIndicator ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#141414', padding: '6px 12px', borderRadius: '6px', border: '1px solid #222' }}>
                <Calendar size={16} color="#A0A0A0" /> 
                <span>{new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')} às {lead.time}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#141414', padding: '6px 12px', borderRadius: '6px', border: '1px solid #222' }}>
                <Users size={16} color="#A0A0A0" /> 
                <span>{lead.guests} pessoas</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#141414', padding: '6px 12px', borderRadius: '6px', border: '1px solid #222' }}>
                <Pizza size={16} color="#A0A0A0" /> 
                <span title={lead.buffet} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.buffet}</span>
              </div>

              {pkg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(122,21,21,0.05)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 90, 90, 0.2)' }}>
                  <Gift size={16} color="#FF5A5A" /> 
                  <span style={{ color: '#FF5A5A', fontWeight: 600 }}>{pkg.title}</span>
                </div>
              )}

            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}><X size={24} /></button>
        </div>

        <div className="crm-modal-body" style={{ paddingTop: '8px' }}>
          
          {/* Status Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #222' }}>
            <span style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 600 }}>Status do Lead:</span>
            <select 
              value={lead.status} 
              onChange={(e) => onUpdateStatus(lead.id!, e.target.value as CRMStage)}
              style={{ background: '#1A1A1A', color: '#FFF', border: '1px solid #333', padding: '8px 16px', borderRadius: '6px', outline: 'none', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}
            >
              <option value="novo">Novo</option>
              <option value="em_contato">Em Contato</option>
              <option value="negociando">Negociando</option>
              <option value="fechado">Fechado / Confirmado</option>
              <option value="perdido">Perdido / Cancelado</option>
            </select>
          </div>

          {/* Core Tabs */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #2A2A2A', marginBottom: '20px' }}>
            <button className={`tab-btn ${activeTab === 'mensagens' ? 'active' : ''}`} onClick={() => setActiveTab('mensagens')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Inbox size={16} /> Mensagens Prontas
            </button>
            <button className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`} onClick={() => setActiveTab('notas')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} /> Notas / Contexto
            </button>
          </div>

          {/* MSG Tab */}
          {activeTab === 'mensagens' && (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button className="template-btn" onClick={() => setMessage(getTemplate('contato1'))}>Primeiro Contato</button>
                <button className="template-btn" onClick={() => setMessage(getTemplate('followup'))}>Follow-up</button>
                <button className="template-btn" onClick={() => setMessage(getTemplate('proposta'))}>Proposta</button>
                <button className="template-btn" onClick={() => setMessage(getTemplate('fechamento'))}>Confirmar</button>
              </div>

              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Selecione um template acima ou digite sua resposta aqui..."
                style={{ width: '100%', height: '160px', background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '16px', color: '#FFF', resize: 'none', fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
              />

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  onClick={handleCopyTextOnly}
                  disabled={!message}
                  style={{ flex: 1, padding: '14px', background: '#2A2A2A', color: '#FFF', border: '1px solid #444', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: message ? 'pointer' : 'not-allowed', opacity: message ? 1 : 0.5 }}
                >
                  Apenas Copiar Texto
                </button>

                <button 
                  onClick={handleOpenWA}
                  disabled={!message}
                  style={{ flex: 2, padding: '14px', background: '#FBBF24', color: '#1A0A0A', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: message ? 'pointer' : 'not-allowed', opacity: message ? 1 : 0.5 }}
                >
                  <Copy size={18} /> Copiar e Abrir WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* NOTES Tab */}
          {activeTab === 'notas' && (
            <div>
              {lead.notes && (
                <div style={{ background: '#101010', padding: '16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '3px solid #FF5A5A', border: '1px solid #222' }}>
                  <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Cliente enviou no formulário:</span>
                  <p style={{ color: '#E0E0E0', fontSize: '14px', fontStyle: 'italic' }}>"{lead.notes}"</p>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#A0A0A0', fontWeight: 600 }}>Anotações da Administração</span>
                {saveIndicator && <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14}/> Salvo com sucesso</span>}
              </div>
              
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Exemplo: Falei com ela e pediu para ligar mais tarde..."
                style={{ width: '100%', height: '150px', background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '16px', color: '#FFF', resize: 'none', fontFamily: "'Inter', sans-serif", fontSize: '14px', marginBottom: '12px' }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleSaveNotes}
                  className="template-btn"
                  style={{ background: '#FFF', color: '#000', padding: '10px 20px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={16} /> Salvar Anotações
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
