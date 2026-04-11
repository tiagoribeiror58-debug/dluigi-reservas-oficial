import { useState, useEffect } from "react";
import { Reservation, CRMStage, Package, AdminNote } from "@/types/reservation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Phone, Mail, Clock, MessageSquare, Plus, FileText, History, X, BadgeCent, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CRMLeadModalProps {
  lead: Reservation;
  packages: Package[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: CRMStage) => void;
  onUpdateNotes: (id: string, notes: AdminNote[] | any) => void;
}

const STAGES: { id: CRMStage; label: string }[] = [
  { id: 'novo', label: 'Novo' },
  { id: 'em_contato', label: 'Em Contato' },
  { id: 'negociando', label: 'Negociando' },
  { id: 'fechado', label: 'Fechado' },
  { id: 'perdido', label: 'Perdido' },
];

export default function CRMLeadModal({ lead, packages, onClose, onUpdateStatus, onUpdateNotes }: CRMLeadModalProps) {
  const [activeTab, setActiveTab] = useState<'mensagens' | 'notas' | 'historico' | 'detalhes'>('mensagens');
  const [noteText, setNoteText] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);

  const existingNotes: AdminNote[] = Array.isArray(lead.admin_notes) ? lead.admin_notes : [];
  const pkg = packages.find(p => p.title === lead.eventType);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase.from('message_templates').select('*').order('order_index');
      if (data) setTemplates(data);
    };
    fetchTemplates();
  }, []);

  const copyPhone = () => {
    if (lead.phone) {
      navigator.clipboard.writeText(lead.phone);
      toast.success("Telefone copiado!");
    }
  };

  const handleSaveNotes = () => {
    if (!noteText.trim()) {
       toast.error("A anotação vazia não pode ser salva.");
       return;
    }
    const newNote: AdminNote = {
      id: crypto.randomUUID(),
      text: noteText,
      created_at: new Date().toISOString(),
      author: "Admin"
    };
    onUpdateNotes(lead.id!, [...existingNotes, newNote]);
    setNoteText("");
    toast.success("Anotação adicionada.");
  };

  const handleStatusChange = (status: string) => {
    onUpdateStatus(lead.id!, status as CRMStage);
    toast.success("Status atualizado.", { icon: "✓" });
  };

  const openWhatsApp = () => {
    let cleanPhone = lead.phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('55')) cleanPhone = '55' + cleanPhone;
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const interpolateTemplate = (content: string) => {
    if (!content) return '';
    return content
      .replace(/{nome}/g, lead.name.split(' ')[0] || '')
      .replace(/{data}/g, new Date(lead.date+'T12:00').toLocaleDateString('pt-BR'))
      .replace(/{horario}/g, lead.time || '')
      .replace(/{pessoas}/g, lead.guests || '')
      .replace(/{pacote}/g, lead.eventType || '');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(interpolateTemplate(content));
    toast.success("Mensagem copiada para a área de transferência!");
  };

  // Helper to get status color badge
  const getStatusBadge = (status: string) => {
    if (status === 'novo') return 'bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/30';
    if (status === 'em_contato') return 'bg-[#eab308]/20 text-[#facc15] border-[#eab308]/30';
    if (status === 'fechado') return 'bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/30';
    if (status === 'perdido') return 'bg-[#ef4444]/20 text-[#f87171] border-[#ef4444]/30';
    return 'bg-white/10 text-white/70 border-white/20'; // negociando
  };

  const statusLabel = STAGES.find(s => s.id === lead.status)?.label || 'Novo';

  return (
    <Dialog open={true} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl bg-[#1A1A1D] border border-white/[0.08] text-white p-0 overflow-hidden shadow-2xl rounded-2xl w-[95vw]">
        
        {/* Header Block */}
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.05] bg-[#141416] relative flex flex-wrap gap-6 items-start justify-between">
          <button onClick={onClose} className="absolute top-4 right-4 text-[#888] hover:text-white transition-colors">
            <X size={20} />
          </button>

          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">{lead.name}</h2>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getStatusBadge(lead.status || 'novo')}`}>
                {statusLabel}
              </span>
              <span className="text-xs text-[#888]">via site_reserva</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-center gap-3 text-sm text-[#D4D4D8]">
                <Phone className="w-4 h-4 text-[#888]" />
                {lead.phone}
                <button onClick={copyPhone} className="p-1 hover:bg-white/10 rounded-md transition-colors text-[#888] hover:text-white"><Copy size={14} /></button>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#D4D4D8]">
                <Mail className="w-4 h-4 text-[#888]" />
                <span className="text-[#888] italic">Não informado</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#D4D4D8]">
                <Clock className="w-4 h-4 text-[#888]" />
                Prazo: <span className="font-medium text-white">{new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')} às {lead.time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#D4D4D8]">
                <BadgeCent className="w-4 h-4 text-[#888]" />
                Pacote: <span className="font-medium text-[#FF5A5A]">{lead.eventType} ({lead.guests} pessoas)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-8 py-4 border-b border-white/[0.05] flex items-center justify-between flex-wrap gap-4 bg-[#1A1A1D]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#888]">Mudar status:</span>
            <Select value={lead.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[160px] h-9 bg-[#111] border-[#333] text-sm text-white focus:ring-0 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-[#333] text-white rounded-lg z-[200]">
                {STAGES.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="cursor-pointer focus:bg-white/10 focus:text-white">
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openWhatsApp} className="h-9 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-lg transition-colors">
            <MessageSquare className="w-4 h-4 mr-2" /> Enviar Mensagem Avulsa
          </Button>
        </div>

        {/* Content Tabs */}
        <div className="p-8">
          <div className="flex gap-2 mb-6 p-1 bg-[#111] rounded-xl border border-white/[0.05] w-max">
            {[
              { id: 'mensagens', label: 'Mensagens' },
              { id: 'notas', label: 'Notas' },
              { id: 'historico', label: 'Histórico' },
              { id: 'detalhes', label: 'Detalhes Extras' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id ? 'bg-[#222] text-white shadow-sm' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'mensagens' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                {templates.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplateIdx(idx)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeTemplateIdx === idx ? 'bg-[#FF5A5A] text-white' : 'bg-[#222] text-[#888] hover:bg-[#333]'}`}
                  >
                    {t.name}
                  </button>
                ))}
                {templates.length === 0 && <span className="text-[#888] text-sm italic">Nenhum template cadastrado no CRM.</span>}
              </div>

              {templates.length > 0 && (
                <div className="bg-[#111] border border-white/[0.05] rounded-xl p-5 relative mt-2 group">
                  <span className="block text-xs uppercase tracking-wider text-[#666] font-semibold mb-3">
                    {templates[activeTemplateIdx].category || 'Mensagem'}
                  </span>
                  <div className="text-sm text-[#D4D4D8] leading-relaxed whitespace-pre-wrap font-sans">
                    {interpolateTemplate(templates[activeTemplateIdx].content)}
                  </div>
                  
                  <button
                    onClick={() => copyMessage(templates[activeTemplateIdx].content)}
                    className="w-full mt-6 py-3 bg-[#FFCE00] hover:bg-[#E6BA00] text-black font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_4px_14px_0_rgba(255,206,0,0.2)]"
                  >
                    <Copy size={16} /> Copiar Mensagem
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notas' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <Textarea
                placeholder="Adicione uma nota interna para equipe..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="bg-[#111] border-[#333] text-white min-h-[120px] focus:border-[#FF5A5A] focus:ring-0 rounded-xl p-4 resize-none"
              />
              <div className="flex justify-end">
                <Button onClick={handleSaveNotes} className="bg-white/10 hover:bg-white/20 text-white border-0">
                  <Save className="w-4 h-4 mr-2" /> Salvar Nota
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200 pr-2">
              {existingNotes.length === 0 ? (
                <div className="text-[#666] italic text-center py-8">Nenhum histórico encontrado.</div>
              ) : (
                existingNotes.map((note) => (
                  <div key={note.id} className="p-4 bg-[#111] border border-[#222] rounded-xl">
                     <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-semibold text-[#888]">{note.author}</span>
                         <span className="text-xs text-[#555]">{new Date(note.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                      <p className="text-sm text-[#D4D4D8] leading-relaxed">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'detalhes' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
               <div className="bg-[#111] rounded-xl p-5 border border-white/[0.05]">
                 <h4 className="text-sm font-semibold mb-3 text-[#AAA] flex items-center gap-2"><FileText size={16} /> Observações do Cliente</h4>
                 <p className="text-sm text-[#D4D4D8] leading-relaxed whitespace-pre-wrap">
                   {lead.notes || "Sem observações no ato da reserva."}
                 </p>
               </div>
               {lead.birthday && (
                 <div className="bg-[#FF5A5A]/10 rounded-xl p-5 border border-[#FF5A5A]/20">
                   <h4 className="text-sm font-semibold mb-2 text-[#FF5A5A]">Aniversariante! 🎂</h4>
                   <p className="text-sm text-[#FF5A5A]/80">O cliente marcou a ocasião como um aniversário.</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
