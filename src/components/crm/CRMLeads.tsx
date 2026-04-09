import { useState } from 'react';
import { Package, Reservation, CRMStage } from '@/types/reservation';
import CRMLeadModal from './CRMLeadModal';
import { Search, Gift, FilterX, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CRMLeadsProps {
  leads: Reservation[];
  packages: Package[];
  onUpdateStatus: (id: string, status: CRMStage) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function CRMLeads({ leads, packages, onUpdateStatus, onUpdateNotes }: CRMLeadsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [datePreset, setDatePreset] = useState('Todos');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [selectedLead, setSelectedLead] = useState<Reservation | null>(null);

  // Filter Logic
  let display = leads;
  if (statusFilter !== 'Todos') {
    display = display.filter(l => l.status === statusFilter);
  }
  if (searchTerm.trim()) {
    const s = searchTerm.toLowerCase();
    display = display.filter(l => l.name.toLowerCase().includes(s) || l.phone.includes(s));
  }
  let filterStart = '';
  let filterEnd = '';
  
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (datePreset === 'Hoje') {
    filterStart = todayStr;
    filterEnd = todayStr;
  } else if (datePreset === 'Amanhã') {
    const tmr = new Date(today);
    tmr.setDate(today.getDate() + 1);
    filterStart = `${tmr.getFullYear()}-${String(tmr.getMonth() + 1).padStart(2, '0')}-${String(tmr.getDate()).padStart(2, '0')}`;
    filterEnd = filterStart;
  } else if (datePreset === 'Proximos7') {
    filterStart = todayStr;
    const next7 = new Date(today);
    next7.setDate(today.getDate() + 7);
    filterEnd = `${next7.getFullYear()}-${String(next7.getMonth() + 1).padStart(2, '0')}-${String(next7.getDate()).padStart(2, '0')}`;
  } else if (datePreset === 'EsteMes') {
    const lastDay = new Date(yyyy, today.getMonth() + 1, 0).getDate();
    filterStart = `${yyyy}-${mm}-01`;
    filterEnd = `${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`;
  } else if (datePreset === 'Personalizado') {
    filterStart = dateStart;
    filterEnd = dateEnd;
  }

  if (filterStart) {
    display = display.filter(l => l.date >= filterStart);
  }
  if (filterEnd) {
    display = display.filter(l => l.date <= filterEnd);
  }

  const getStatusColor = (st?: string) => {
    switch(st) {
      case 'novo': return '#FBBF24'; // yellow
      case 'em_contato': return '#60A5FA'; // blue
      case 'negociando': return '#F97316'; // orange
      case 'fechado': return '#10B981'; // green
      case 'perdido': return '#EF4444'; // red
      default: return '#888';
    }
  };

  const getStatusLabel = (st?: string) => {
    switch(st) {
      case 'novo': return 'Novo';
      case 'em_contato': return 'Em Contato';
      case 'negociando': return 'Negociando';
      case 'fechado': return 'Fechado';
      case 'perdido': return 'Perdido';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="crm-fade-in flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">Leads</h2>
        <p className="text-[#888] font-medium">{leads.length} leads cadastrados no pipeline</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-[#0C0C0C] p-4 rounded-xl border border-[#222]">
        <div className="w-[180px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
             <SelectTrigger className="w-full bg-[#1A1A1A] border-[#333] text-white">
               <SelectValue placeholder="Status" />
             </SelectTrigger>
             <SelectContent className="bg-[#1A1A1A] border-[#333] text-white">
                <SelectItem value="Todos">Todos Status</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="em_contato">Em Contato</SelectItem>
                <SelectItem value="negociando">Negociando</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
             </SelectContent>
          </Select>
        </div>
        
        <div className="w-[200px]">
          <Select value={datePreset} onValueChange={setDatePreset}>
             <SelectTrigger className="w-full bg-[#1A1A1A] border-[#333] text-white">
               <SelectValue placeholder="Período" />
             </SelectTrigger>
             <SelectContent className="bg-[#1A1A1A] border-[#333] text-white">
                <SelectItem value="Todos">📅 Qualquer Data</SelectItem>
                <SelectItem value="Hoje">Hoje</SelectItem>
                <SelectItem value="Amanhã">Amanhã</SelectItem>
                <SelectItem value="Proximos7">Próximos 7 dias</SelectItem>
                <SelectItem value="EsteMes">Este Mês</SelectItem>
                <SelectItem value="Personalizado">Personalizado...</SelectItem>
             </SelectContent>
          </Select>
        </div>

        {datePreset === 'Personalizado' && (
          <div className="flex items-center gap-2 animate-in slide-in-from-left-4">
            <input 
              type="date" 
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="bg-[#1A1A1A] text-white border border-[#333] px-3 py-2 rounded-md outline-none text-sm transition-colors focus:border-[#FF5A5A] [color-scheme:dark]"
              title="Data inicial"
            />
            <span className="text-[#888] text-sm font-medium">até</span>
            <input 
              type="date" 
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="bg-[#1A1A1A] text-white border border-[#333] px-3 py-2 rounded-md outline-none text-sm transition-colors focus:border-[#FF5A5A] [color-scheme:dark]"
              title="Data final"
            />
          </div>
        )}

        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#333] text-white pl-9 pr-4 py-2 rounded-md outline-none text-sm focus:border-[#FF5A5A] transition-colors placeholder:text-[#555]"
          />
        </div>
      </div>

      <div className="flex-1 bg-[#0C0C0C] border border-[#222] rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="h-full overflow-y-auto crm-custom-scrollbar">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-[#151515] sticky top-0 z-10 shadow-sm border-b border-[#222]">
              <tr>
                <th className="px-6 py-4 text-[#888] font-semibold">Nome Principal</th>
                <th className="px-6 py-4 text-[#888] font-semibold">Contato</th>
                <th className="px-6 py-4 text-[#888] font-semibold">Data do Evento</th>
                <th className="px-6 py-4 text-[#888] font-semibold">Especificações</th>
                <th className="px-6 py-4 text-[#888] font-semibold text-right">Status do Deal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {display.map(lead => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className="group cursor-pointer hover:bg-[#151515] transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium group-hover:text-[#FF5A5A] transition-colors">{lead.name}</td>
                  <td className="px-6 py-4 text-[#A0A0A0]">{lead.phone}</td>
                  <td className="px-6 py-4 text-[#A0A0A0]">{new Date(lead.date+'T12:00').toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-[#A0A0A0]">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{lead.buffet}</span>
                      {lead.package_id && (
                         <span className="flex items-center gap-1.5 text-[11px] text-[#FF5A5A] font-semibold font-mono tracking-tight bg-[#FF5A5A]/5 border border-[#FF5A5A]/10 px-2 py-0.5 rounded-full w-fit">
                           <Gift size={12}/> {packages.find(p => p.id === lead.package_id)?.title || 'Pacote Especial'}
                         </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span 
                       className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border"
                       style={{ 
                          color: getStatusColor(lead.status), 
                          borderColor: `${getStatusColor(lead.status)}40`, 
                          backgroundColor: `${getStatusColor(lead.status)}10` 
                       }}
                    >
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {display.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-[#555]">
                      <FilterX size={48} className="mb-4 opacity-20" />
                      <p className="text-base font-medium">Nenhum lead encontrado.</p>
                      <p className="text-sm">Tente ajustar seus filtros para outra data ou status.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <CRMLeadModal 
          lead={selectedLead} 
          packages={packages}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={(id, status) => {
            onUpdateStatus(id, status);
            setSelectedLead(prev => prev ? { ...prev, status } : null);
          }}
          onUpdateNotes={(id, notes) => {
            onUpdateNotes(id, notes);
            setSelectedLead(prev => prev ? { ...prev, admin_notes: notes } : null);
          }}
        />
      )}
    </div>
  );
}
