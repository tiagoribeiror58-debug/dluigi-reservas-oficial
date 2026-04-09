import { useState } from "react";
import { Reservation, CRMStage, Package, AdminNote } from "@/types/reservation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Phone, Calendar, Users, Info, Sparkles, MessageSquare } from "lucide-react";
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

  // Garantir que as notas sempre venham como Array, já que a estrutura migrou para JSONB histórico
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
    toast.success("Nova anotação incluída no histórico do cliente!");
  };

  const handleStatusChange = (status: string) => {
    onUpdateStatus(lead.id!, status as CRMStage);
    toast.info("Status atualizado!");
  };

  const openWhatsApp = () => {
    let cleanPhone = lead.phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('55')) cleanPhone = '55' + cleanPhone;
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <Dialog open={true} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-[#121212] border-[#2A2A2A] text-white">
        <DialogHeader className="border-b border-[#222] pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-white">{lead.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-[#1A1A1A] border-[#333] text-[#CCC] hover:bg-[#1A1A1A]">
                  {lead.eventType}
                </Badge>
                {pkg && (
                  <Badge className="bg-[#FF5A5A]/10 text-[#FF5A5A] border border-[#FF5A5A]/20 hover:bg-[#FF5A5A]/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Pacote Detectado
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-[#CCC]">
            <Phone className="h-4 w-4 shrink-0 text-[#888]" />
            <span>{lead.phone}</span>
            <button onClick={copyPhone} className="p-1 hover:text-[#FF5A5A] transition-colors"><Copy className="h-3 w-3" /></button>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#CCC]">
            <Calendar className="h-4 w-4 shrink-0 text-[#888]" />
            <span>{new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')} às {lead.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#CCC]">
            <Users className="h-4 w-4 shrink-0 text-[#888]" />
            <span>{lead.guests} convidados</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#CCC]">
            <Info className="h-4 w-4 shrink-0 text-[#888]" />
            <span>Refeição: {lead.buffet}</span>
          </div>
        </div>

        {/* Status Change & Actions */}
        <div className="flex items-center gap-3 mt-6 flex-wrap bg-[#0C0C0C] p-3 rounded-xl border border-[#222]">
          <span className="text-sm text-[#888] font-medium">Pipeline:</span>
          <Select value={lead.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48 h-9 text-sm bg-[#1A1A1A] border-[#333] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#333] text-white">
              {STAGES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openWhatsApp} size="sm" className="ml-auto gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold">
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>

        <Tabs defaultValue="context" className="mt-4">
          <TabsList className="bg-[#0C0C0C] border border-[#222] w-full justify-start p-1 rounded-xl">
            <TabsTrigger value="context" className="data-[state=active]:bg-[#222] data-[state=active]:text-white rounded-lg">Anotações Internas</TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-[#222] data-[state=active]:text-white rounded-lg">Detalhes do Evento</TabsTrigger>
          </TabsList>

          <TabsContent value="context" className="space-y-4 mt-4">
            {/* Lista do Hiśtorico */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 crm-custom-scrollbar mb-2">
              {existingNotes.length === 0 ? (
                <div className="text-center py-6 text-[#555] text-sm border border-dashed border-[#222] rounded-xl bg-[#0C0C0C]">
                  Nenhuma anotação neste cliente ainda.
                </div>
              ) : (
                existingNotes.map((note) => (
                  <div key={note.id} className="bg-[#151515] p-3 rounded-lg border border-[#2A2A2A]">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-semibold text-[#888]">{note.author}</span>
                       <span className="text-[10px] text-[#555]">
                         {new Date(note.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                       </span>
                    </div>
                    <p className="text-sm text-[#E2E2E2] whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Input Nova Nota */}
            <div className="relative">
              <Textarea
                placeholder="Adicionar nova anotação de fechamento, ligações ou orçamento..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="!bg-[#0C0C0C] !border-[#333] !text-white min-h-[80px] focus-visible:!ring-[#FF5A5A] resize-y placeholder:text-[#555] pb-10"
              />
              <div className="absolute bottom-2 right-2 flex justify-end">
                <Button onClick={handleSaveNotes} size="sm" className="bg-[#FF5A5A] hover:bg-[#8F1A1A] text-white text-xs h-7">
                  Adicionar Anotação
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-3 mt-4">
            <div className="bg-[#0C0C0C] rounded-lg p-4 border border-[#222]">
               <h4 className="font-semibold text-sm mb-2 text-[#CCC]">Observações do Cliente:</h4>
               <p className="text-sm text-[#888] whitespace-pre-wrap">{lead.notes || "O cliente não deixou nenhuma observação na reserva."}</p>
            </div>
            {lead.birthday && (
              <div className="bg-[#FF5A5A]/10 text-[#FF5A5A] rounded-lg p-3 border border-[#FF5A5A]/20 font-medium text-sm">
                🎂 Possui aniversariante no evento.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
