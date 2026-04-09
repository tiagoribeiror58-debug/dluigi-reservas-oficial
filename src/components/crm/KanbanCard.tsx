import { Reservation } from "@/types/reservation";
import { Pizza, Phone, Users, Calendar } from "lucide-react";

interface KanbanCardProps {
  lead: Reservation;
  onClick: () => void;
}

export function KanbanCard({ lead, onClick }: KanbanCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#0C0C0C] border border-[#222] rounded-xl p-4 cursor-pointer hover:border-[#FF5A5A]/50 transition-all group hover:-translate-y-0.5 shadow-sm"
    >
      <div className="font-semibold text-sm text-foreground truncate flex-1 mb-3 text-white">
        {lead.name}
      </div>
      
      <div className="flex flex-col gap-2 text-xs text-muted-foreground w-full">
        {lead.buffet && (
          <div className="flex items-center gap-1.5 font-medium text-[#FF5A5A]">
            <Pizza className="h-3.5 w-3.5" />
            <span className="truncate">{lead.buffet}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            <span className="truncate">{lead.phone}</span>
          </div>
        )}
        {lead.guests && (
          <div className="flex items-center gap-1.5">
            <Users className="h-3 w-3" />
            <span>{lead.guests} pessoas</span>
          </div>
        )}
        {lead.date && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{new Date(lead.date + 'T12:00').toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
