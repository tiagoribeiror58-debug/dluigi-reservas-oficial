import { Reservation } from '@/types/reservation';
import { Users, UserPlus, Handshake, Trophy, CalendarClock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function CRMDashboard({ leads, loading }: { leads: Reservation[], loading: boolean }) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[#888]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#333] border-t-[#FF5A5A] rounded-full animate-spin" />
          <p className="text-sm font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const total = leads.length;
  const novos = leads.filter(l => l.status === 'novo').length;
  const negociando = leads.filter(l => l.status === 'em_contato' || l.status === 'negociando').length;
  const fechados = leads.filter(l => l.status === 'fechado').length;
  
  const conversionRate = total > 0 ? ((fechados / total) * 100).toFixed(1) : '0.0';

  const statusData = [
    { name: 'Novo', value: novos, color: '#FBBF24' },
    { name: 'Contato', value: leads.filter(l => l.status === 'em_contato').length, color: '#60A5FA' },
    { name: 'Negociando', value: leads.filter(l => l.status === 'negociando').length, color: '#F97316' },
    { name: 'Fechado', value: fechados, color: '#10B981' },
    { name: 'Perdido', value: leads.filter(l => l.status === 'perdido').length, color: '#EF4444' }
  ];

  return (
    <div className="crm-fade-in space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Visão Geral</h2>
        <p className="text-[#888] font-medium">Acompanhe as métricas de conversão e reservas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl flex justify-between group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#60A5FA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-[#888] text-sm font-medium mb-1">Total de Leads</div>
            <div className="text-4xl font-bold text-white tracking-tight">{total}</div>
          </div>
          <div className="w-12 h-12 bg-[#60A5FA]/10 rounded-xl flex items-center justify-center text-[#60A5FA] relative z-10">
            <Users size={24} />
          </div>
        </div>
        
        <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl flex justify-between group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FBBF24]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-[#888] text-sm font-medium mb-1">Novos (Aguardando)</div>
            <div className="text-4xl font-bold text-white tracking-tight">{novos}</div>
          </div>
          <div className="w-12 h-12 bg-[#FBBF24]/10 rounded-xl flex items-center justify-center text-[#FBBF24] relative z-10">
            <UserPlus size={24} />
          </div>
        </div>
        
        <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl flex justify-between group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-[#888] text-sm font-medium mb-1">Em Negociação</div>
            <div className="text-4xl font-bold text-white tracking-tight">{negociando}</div>
          </div>
          <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center text-[#F97316] relative z-10">
            <Handshake size={24} />
          </div>
        </div>
        
        <div className="bg-[#1A1111] border border-[#FF5A5A]/30 rounded-2xl p-6 shadow-xl shadow-red-900/10 flex justify-between group overflow-hidden relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF5A5A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FF5A5A]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="text-[#888] text-sm font-medium mb-1">Reservas Fechadas</div>
            <div className="flex items-baseline gap-2">
               <div className="text-4xl font-bold text-[#FF5A5A] tracking-tight">{fechados}</div>
               <div className="text-sm font-medium text-[#FF5A5A] bg-[#FF5A5A]/10 px-2 py-0.5 rounded-full">{conversionRate}%</div>
            </div>
          </div>
          <div className="w-12 h-12 bg-[#FF5A5A]/10 rounded-xl flex items-center justify-center text-[#FF5A5A] relative z-10">
            <Trophy size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Funil de Leads</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(18, 18, 18, 0.95)', border: '1px solid #333', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center mb-4 border border-[#333]">
               <CalendarClock size={28} className="text-[#888]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Próximos Passos</h3>
            <p className="text-[#888] text-sm max-w-[280px]">
               No futuro, você verá aqui suas próximas reservas agendadas e alertas inteligentes de follow-up.
            </p>
        </div>
      </div>
    </div>
  );
}
