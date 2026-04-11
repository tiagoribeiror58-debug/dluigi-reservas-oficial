import { useState } from "react";
import { Package } from "@/types/reservation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddReservationModalProps {
  packages: Package[];
  onClose: () => void;
}

export default function AddReservationModal({ packages, onClose }: AddReservationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    eventType: packages.length > 0 ? packages[0].title : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('reservations').insert([{
      name: formData.name,
      phone: formData.phone,
      date: formData.date,
      time: formData.time || "12:00",
      guests: parseInt(formData.guests) || 1,
      event_type: formData.eventType,
      status: 'novo',
      buffet: 'Acesso Padrão',
      notes: "Reserva adicionada manualmente pelo painel."
    }]);

    setLoading(false);
    if (error) {
      console.error(error);
      toast.error("Erro ao criar reserva.");
    } else {
      toast.success("Reserva adicionada com sucesso!");
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#111] border-[#333] text-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Adicionar Reserva</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#888]">Nome do Cliente *</Label>
            <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-[#1A1A1A] border-[#333] focus-visible:ring-[#FF5A5A]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#888]">WhatsApp *</Label>
            <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-[#1A1A1A] border-[#333] focus-visible:ring-[#FF5A5A]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-[#888]">Data *</Label>
              <Input type="date" id="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="bg-[#1A1A1A] border-[#333] focus-visible:ring-[#FF5A5A]" style={{colorScheme: 'dark'}} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-[#888]">Horário</Label>
              <Input type="time" id="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="bg-[#1A1A1A] border-[#333] focus-visible:ring-[#FF5A5A]" style={{colorScheme: 'dark'}} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-[#888]">Pessoas</Label>
              <Input type="number" min="1" id="guests" value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} className="bg-[#1A1A1A] border-[#333] focus-visible:ring-[#FF5A5A]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#888]">Pacote</Label>
              <Select value={formData.eventType} onValueChange={v => setFormData({...formData, eventType: v})}>
                <SelectTrigger className="bg-[#1A1A1A] border-[#333] focus-visible:ring-[#FF5A5A]">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333] text-white">
                  {packages.map(p => (
                    <SelectItem key={p.id} value={p.title}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
             <Button type="button" variant="ghost" onClick={onClose} className="text-[#888] hover:text-white hover:bg-white/5">Cancelar</Button>
             <Button type="submit" disabled={loading} className="bg-[#FF5A5A] hover:bg-[#FF4A4A] text-white font-medium">
               {loading ? 'Salvando...' : 'Criar Reserva'}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
