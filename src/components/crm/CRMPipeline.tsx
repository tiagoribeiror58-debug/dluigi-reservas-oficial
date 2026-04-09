import { useState, useMemo } from 'react';
import { Reservation, CRMStage, Package } from '@/types/reservation';
import CRMLeadModal from './CRMLeadModal';
import { KanbanCard } from './KanbanCard';
import { Input } from '@/components/ui/input';
import { DragDropContext, Droppable, Draggable, type DropResult, type DroppableProvided, type DroppableStateSnapshot, type DraggableProvided, type DraggableStateSnapshot } from "@hello-pangea/dnd";
import { Search } from 'lucide-react';
import { toast } from "sonner";

interface CRMPipelineProps {
  leads: Reservation[];
  packages: Package[];
  onUpdateStatus: (id: string, status: CRMStage) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

const STAGES: { id: CRMStage; label: string; width: string }[] = [
  { id: 'novo', label: 'Novo', width: '250px' },
  { id: 'em_contato', label: 'Em Contato', width: '250px' },
  { id: 'negociando', label: 'Negociando', width: '250px' },
  { id: 'fechado', label: 'Fechado', width: '200px' },
  { id: 'perdido', label: 'Perdido', width: '200px' },
];

export default function CRMPipeline({ leads, packages, onUpdateStatus, onUpdateNotes }: CRMPipelineProps) {
  const [selectedLead, setSelectedLead] = useState<Reservation | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q) ||
        l.buffet?.toLowerCase().includes(q)
    );
  }, [leads, search]);

  const columns = useMemo(
    () =>
      STAGES.map((stage) => ({
        status: stage.id,
        label: stage.label,
        width: stage.width,
        leads: filtered.filter((l) => l.status === stage.id),
      })),
    [filtered]
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as CRMStage;
    const leadId = result.draggableId;
    if (leads.find((l) => l.id === leadId)?.status === newStatus) return;
    
    // Optimistic UI state from parent takes care of immediate swap
    onUpdateStatus(leadId, newStatus);
    toast.success(`Movido para ${STAGES.find(s => s.id === newStatus)?.label}`);
  };

  return (
    <div className="crm-fade-in flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="view-title text-2xl font-bold text-white">Pipeline</h2>
          <p className="view-sub text-sm text-[#888]">{leads.length} leads no total</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888]" />
          <Input
            placeholder="Buscar por nome, telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#111] border-[#333] text-white focus-visible:ring-[#FF5A5A]"
          />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto flex-1 pb-4 items-start">
          {columns.map((col) => (
            <Droppable droppableId={col.status} key={col.status}>
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-shrink-0 flex flex-col rounded-xl p-3 transition-colors border border-[#222] min-h-[500px] h-fit max-h-[75vh] ${
                    snapshot.isDraggingOver ? "bg-[#fff]/5 border-[#FF5A5A]/30" : "bg-transparent"
                  }`}
                  style={{ minWidth: col.width }}
                >
                  <div className="flex items-center justify-between mb-4 px-1 border-b border-[#222] pb-3 shrink-0">
                    <h3 className="text-[15px] font-semibold text-white">{col.label}</h3>
                    <span className="text-xs bg-[#1A1A1A] rounded-full px-2.5 py-0.5 text-[#888] font-medium border border-[#333]">
                      {col.leads.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3 flex-1 flex flex-col overflow-y-auto pr-1">
                    {col.leads.map((lead, index) => (
                      <Draggable key={lead.id + (lead.status || '')} draggableId={lead.id!} index={index}>
                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                          >
                            <KanbanCard lead={lead} onClick={() => setSelectedLead(lead)} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {selectedLead && (
        <CRMLeadModal 
          lead={selectedLead} 
          packages={packages}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={(id, status) => {
            onUpdateStatus(id, status);
            setSelectedLead(null); 
          }}
          onUpdateNotes={(id, notes) => onUpdateNotes(id, notes)} 
        />
      )}
    </div>
  );
}
