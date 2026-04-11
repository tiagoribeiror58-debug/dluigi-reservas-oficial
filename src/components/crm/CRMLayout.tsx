import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Reservation, CRMView, Package } from '@/types/reservation';
import { LayoutDashboard, Columns, Users, Package as PackageIcon, LogOut, Menu, X, MessageSquare } from 'lucide-react';
import CRMDashboard from './CRMDashboard';
import CRMPipeline from './CRMPipeline';
import CRMLeads from './CRMLeads';
import CRMPackages from './CRMPackages';
import CRMTemplates from './CRMTemplates';
import './crm.css';

interface CRMLayoutProps {
  session: Session | null;
}

export default function CRMLayout({ session }: CRMLayoutProps) {
  const [activeView, setActiveView] = useState<CRMView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leads, setLeads] = useState<Reservation[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
    loadPackages();

    const channel = supabase
      .channel('public:reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        loadLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    if (!error) setLeads(data as Reservation[]);
    setLoading(false);
  };

  const loadPackages = async () => {
    const { data } = await supabase.from('packages').select('*');
    if (data) setPackages(data as Package[]);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    // Optimistic UI Update para refletir a drag-and-drop instantaneamente
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));

    const { error } = await supabase.from('reservations').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      console.error(error);
      // Opcional: Recarregar do banco se falhar para reverter o estado
      loadLeads();
    }
  };

  const handleUpdateNotes = async (id: string, admin_notes: string) => {
    // Optimistic UI Update
    setLeads(prev => prev.map(l => l.id === id ? { ...l, admin_notes } : l));

    const { error } = await supabase.from('reservations').update({ admin_notes, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) console.error(error);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <CRMDashboard leads={leads} loading={loading} />;
      case 'pipeline': return <CRMPipeline leads={leads} packages={packages} onUpdateStatus={handleUpdateStatus} onUpdateNotes={handleUpdateNotes} onCreated={loadLeads} />;
      case 'leads': return <CRMLeads leads={leads} packages={packages} onUpdateStatus={handleUpdateStatus} onUpdateNotes={handleUpdateNotes} />;
      case 'pacotes': return <CRMPackages />;
      case 'templates': return <CRMTemplates />;
      default: return <div style={{ color: 'white', padding: 40 }}>Módulo em desenvolvimento...</div>;
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'pipeline': return 'Quadro de Reservas';
      case 'leads': return 'Lista de Reservas';
      case 'pacotes': return 'Sessões de Reservas';
      case 'templates': return 'Templates de Mensagem';
      default: return 'CRM';
    }
  };

  return (
    <div className="dark flex h-screen w-screen bg-[#0A0A0A] text-[#EDEDED] font-sans antialiased overflow-hidden selection:bg-[#FF5A5A]/30 relative">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[260px] bg-[#0C0C0C] border-r border-[#1A1A1A] flex flex-col fixed lg:static inset-y-0 left-0 z-50 shadow-xl shadow-black/50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-[#1A1A1A] flex items-center justify-between lg:justify-center">
          <img src="/logo.jpg" alt="D'Luigi Reservas" className="w-[120px] rounded-xl shadow-md border border-[#222]" />
          <button className="lg:hidden text-[#888] hover:text-[#E2E2E2]" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 p-5 flex flex-col gap-1.5 overflow-y-auto">
          <span className="text-[10px] font-bold text-[#555] uppercase tracking-[0.15em] mb-3 ml-2 mt-2">Menu Principal</span>
          
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'pipeline', label: 'Quadro de Reservas', icon: Columns },
            { id: 'leads', label: 'Lista de Reservas', icon: Users },
            { id: 'pacotes', label: 'Sessões de Reservas', icon: PackageIcon },
            { id: 'templates', label: 'Templates', icon: MessageSquare },
          ].map((item) => (
            <button 
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                activeView === item.id 
                  ? 'bg-[#FF5A5A]/10 text-[#FF5A5A] border border-[#FF5A5A]/10 shadow-[inset_0_0_0_1px_rgba(255,90,90,0.05)]' 
                  : 'text-[#888] hover:bg-[#141414] hover:text-[#E2E2E2] border border-transparent'
              }`} 
              onClick={() => { setActiveView(item.id as CRMView); setIsSidebarOpen(false); }}
            >
              <item.icon size={18} className={`transition-colors ${activeView === item.id ? 'text-[#FF5A5A]' : 'text-[#666] group-hover:text-[#AAA]'}`} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-5 border-t border-[#1A1A1A]">
          <button className="flex items-center w-full gap-3 px-4 py-3 text-[#888] hover:text-[#FF5A5A] hover:bg-[#FF5A5A]/5 rounded-lg transition-all text-sm font-medium" onClick={handleLogout}>
            <LogOut size={18} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#101010] relative z-10">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FF5A5A]/5 rounded-full blur-[120px] pointer-events-none" />

        <header className="h-[72px] bg-[#0C0C0C]/80 backdrop-blur-md border-b border-[#1A1A1A] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-[#888] hover:text-[#E2E2E2] p-1 -ml-1 rounded-md hover:bg-[#1A1A1A]" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex w-8 h-8 rounded-lg bg-[#FF5A5A]/10 items-center justify-center border border-[#FF5A5A]/20">
              <LayoutDashboard size={16} className="text-[#FF5A5A]" />
            </div>
            <h1 className="text-lg font-semibold text-[#E2E2E2] capitalize tracking-tight">{getViewTitle()}</h1>
          </div>
          {session?.user?.email && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center">
                 <span className="text-xs text-[#888] font-bold">{session.user.email.charAt(0).toUpperCase()}</span>
              </div>
              <div className="text-sm text-[#888] font-medium hidden md:block">{session.user.email}</div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 crm-custom-scrollbar">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

