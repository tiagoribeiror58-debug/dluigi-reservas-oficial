import { useState } from "react";
import { Reservation, CRMStage, Package, AdminNote } from "@/types/reservation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Phone, Calendar, Users, Info, Sparkles, MessageSquare, Plus, Clock, Gift } from "lucide-react";
import { toast } from "sonner";

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
  const [noteText, setNoteText] = useState("");
  const pkg = packages.find(p => p.title === lead.eventType);

  const existingNotes: AdminNote[] = Array.isArray(lead.admin_notes) ? lead.admin_notes : [];

  const copyPhone = () => {
    if (lead.phone) {
      navigator.clipboard.writeText(lead.phone);
      toast.success("Telefone copiado!");
    }
  };

  const handleSaveNotes = () => {
    if (!noteText.trim()) {
       toast.error("A anotação não pode ficar vazia.");
       return;
    }
    
    const newNote: AdminNote = {
      id: crypto.randomUUID(),
      text: noteText,
      created_at: new Date().toISOString(),
      author: "Admin"
    };

    const updatedNotes = [...existingNotes, newNote];
    onUpdateNotes(lead.id!, updatedNotes);
    setNoteText("");
    toast.success("Anotação adicionada com sucesso.");
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

  return (
    <Dialog open={true} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-[#090909]/95 backdrop-blur-3xl border border-white/[0.04] text-white p-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 border-b border-white/[0.04] bg-white/[0.01]">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-semibold tracking-tight text-[#EAEAEA] font-sans">
                  {lead.name}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge className="bg-white/[0.05] border-white/[0.05] text-[#A1A1AA] hover:bg-white/[0.08] font-medium px-2.5 py-1 backdrop-blur-sm">
                    {lead.eventType}
                  </Badge>
                  {pkg && (
                    <Badge className="bg-red-500/[0.08] text-red-400 border border-red-500/20 hover:bg-red-500/10 font-medium px-2.5 py-1 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3 mr-1.5 opacity-70" />
                      Pacote Identificado
                    </Badge>
                  )}
                </div>
              </div>
              {pkg?.image_urls && pkg.image_urls.length > 0 && (
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg shrink-0 ml-4 border border-white/[0.05]">
                  <img src={pkg.image_urls[0]} alt="Pacote" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Info Area */}
        <div className="px-8 py-6 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.02]">
              <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#666] uppercase">
                <Phone className="h-3.5 w-3.5" /> Contato
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#D4D4D8]">{lead.phone}</span>
                <button onClick={copyPhone} className="text-[#666] hover:text-[#EAEAEA] transition-colors"><Copy className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.02]">
              <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#666] uppercase">
                <Calendar className="h-3.5 w-3.5" /> Data & Hora
              </span>
              <span className="text-sm font-medium text-[#D4D4D8]">
                {new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')} às {lead.time}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.02]">
              <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#666] uppercase">
                <Users className="h-3.5 w-3.5" /> Convidados
              </span>
              <span className="text-sm font-medium text-[#D4D4D8]">
                {lead.guests} pessoas
              </span>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.02]">
              <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#666] uppercase">
                <Info className="h-3.5 w-3.5" /> Refeição
              </span>
              <span className="text-sm font-medium text-[#D4D4D8]">
                {lead.buffet}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-1.5 bg-white/[0.03] backdrop-blur border border-white/[0.04] rounded-2xl relative z-50">
            <div className="flex items-center flex-1 min-w-0 pl-3 relative z-[100]">
              <span className="text-xs uppercase tracking-wider text-[#666] font-semibold mr-3 shrink-0">Pipeline</span>
              <Select value={lead.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="border-none bg-transparent hover:bg-white/[0.04] focus:ring-0 text-[#EAEAEA] font-medium h-10 w-full rounded-xl transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border border-white/[0.08] text-[#EAEAEA] rounded-xl shadow-2xl z-[200] max-h-60 overflow-hidden">
                  {STAGES.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="cursor-pointer focus:bg-white/[0.06] focus:text-white rounded-lg mx-1 my-0.5">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={openWhatsApp} className="h-10 px-5 rounded-xl bg-[#1D9945] hover:bg-[#168539] text-white font-medium border-none shadow-[0_4px_14px_0_rgba(29,153,69,0.2)] transition-all">
              <MessageSquare className="h-4 w-4 mr-2 opacity-80" />
              Conversar
            </Button>
          </div>

          <Tabs defaultValue="actions" className="w-full">
            <TabsList className="bg-transparent border-b border-white/[0.04] w-full justify-start p-0 rounded-none h-auto mb-4">
              <TabsTrigger value="actions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF5A5A] data-[state=active]:text-white text-[#888] data-[state=active]:bg-transparent py-3 px-4 font-medium transition-colors">Histórico & Ações</TabsTrigger>
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF5A5A] data-[state=active]:text-white text-[#888] data-[state=active]:bg-transparent py-3 px-4 font-medium transition-colors">Informações Extras</TabsTrigger>
            </TabsList>

            <TabsContent value="actions" className="space-y-4 focus:outline-none mt-0">
              <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2 crm-custom-scrollbar">
                {existingNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/[0.05]">
                    <Clock className="w-6 h-6 text-[#444] mb-2" />
                    <span className="text-sm font-medium text-[#666]">Nenhum histórico registrado</span>
                  </div>
                ) : (
                  existingNotes.map((note) => (
                    <div key={note.id} className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-semibold text-[#888]">{note.author}</span>
                         <span className="text-[10px] text-[#555] font-medium tracking-wide">
                           {new Date(note.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                         </span>
                      </div>
                      <p className="text-sm text-[#D4D4D8] leading-relaxed whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="relative pt-2">
                <Textarea
                  placeholder="Adicionar registro da interação..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="bg-white/[0.02] border-white/[0.06] text-[#EAEAEA] min-h-[90px] focus-visible:ring-1 focus-visible:ring-[#FF5A5A]/50 focus-visible:bg-white/[0.04] resize-none placeholder:text-[#555] rounded-2xl pb-12 transition-all p-4"
                />
                <div className="absolute bottom-4 right-4">
                  <Button onClick={handleSaveNotes} size="sm" className="bg-[#FF5A5A]/10 hover:bg-[#FF5A5A]/20 text-[#FF5A5A] border border-[#FF5A5A]/20 shadow-none font-medium text-xs px-4 h-8 rounded-lg transition-all">
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Salvar Log
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 focus:outline-none mt-0">
              <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/[0.04]">
                 <h4 className="text-xs uppercase tracking-wider font-semibold mb-3 text-[#666]">Detalhes da Celebração</h4>
                 <p className="text-sm text-[#D4D4D8] leading-relaxed whitespace-pre-wrap">
                   {lead.notes || "O cliente não adicionou observações extras no ato do cadastro."}
                 </p>
              </div>
              
              {lead.birthday && (
                <div className="flex items-center gap-3 bg-[#FF5A5A]/5 rounded-2xl p-4 border border-[#FF5A5A]/10">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF5A5A]/10">
                    <Gift className="w-4 h-4 text-[#FF5A5A]" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#FF5A5A]">Aniversariante Presente</span>
                    <span className="block text-xs text-[#FF5A5A]/70">Ofereça vantagens ou felicite o cliente</span>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
