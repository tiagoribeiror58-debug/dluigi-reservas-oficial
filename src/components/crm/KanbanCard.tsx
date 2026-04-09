import { Reservation } from "@/types/reservation";
import { Pizza, Phone, Users, Calendar, GripVertical } from "lucide-react";

interface KanbanCardProps {
  lead: Reservation;
  onClick: () => void;
}

export function KanbanCard({ lead, onClick }: KanbanCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#121212] border border-[#222] rounded-xl p-4 cursor-pointer hover:border-[#FF5A5A]/50 hover:bg-[#1A1A1A] transition-all group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,90,90,0.12)] relative overflow-hidden"
    >
      <div className="absolute top-3 right-3 text-[#333] group-hover:text-[#555] transition-colors cursor-grab active:cursor-grabbing">
        <GripVertical size={16} />
      </div>
      
      <div className="font-semibold text-[15px] text-white truncate pr-6 mb-3">
        {lead.name}
      </div>
      
      <div className="flex flex-col gap-2.5 text-[13px] text-[#A0A0A0] w-full">
        {lead.buffet && (
          <div className="flex items-center gap-2 font-medium text-[#FF5A5A] bg-[#FF5A5A]/5 border border-[#FF5A5A]/10 w-fit px-2 py-0.5 rounded-md">
            <Pizza className="h-3.5 w-3.5" />
            <span className="truncate">{lead.buffet}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2 group-hover:text-[#CCC] transition-colors">
            <Phone className="h-3.5 w-3.5 text-[#666] group-hover:text-[#FF5A5A] transition-colors" />
            <span className="truncate">{lead.phone}</span>
          </div>
        )}
        {lead.guests && (
          <div className="flex items-center gap-2 group-hover:text-[#CCC] transition-colors">
            <Users className="h-3.5 w-3.5 text-[#666] group-hover:text-[#FF5A5A] transition-colors" />
            <span>{lead.guests} pessoas</span>
          </div>
        )}
        {lead.date && (
          <div className="flex items-center gap-2 group-hover:text-[#CCC] transition-colors">
            <Calendar className="h-3.5 w-3.5 text-[#666] group-hover:text-[#FF5A5A] transition-colors" />
            <span>{new Date(lead.date + 'T12:00').toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
