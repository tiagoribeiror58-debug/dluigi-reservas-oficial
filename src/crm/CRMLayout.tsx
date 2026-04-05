import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { Reservation, CRMView } from '../types';
import { LayoutDashboard, Columns, Users, FileText, Package, HelpCircle, LogOut } from 'lucide-react';
import CRMDashboard from './CRMDashboard';
import CRMPipeline from './CRMPipeline';
import CRMLeads from './CRMLeads';
import CRMAjuda from './CRMAjuda';
import './crm.css';

interface CRMLayoutProps {
  session: Session | null;
}

export default function CRMLayout({ session }: CRMLayoutProps) {
  const [activeView, setActiveView] = useState<CRMView>('dashboard');
  const [leads, setLeads] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();

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
      case 'pipeline': return <CRMPipeline leads={leads} onUpdateStatus={handleUpdateStatus} />;
      case 'leads': return <CRMLeads leads={leads} onUpdateStatus={handleUpdateStatus} onUpdateNotes={handleUpdateNotes} />;
      case 'ajuda': return <CRMAjuda />;
      default: return <div style={{ color: 'white', padding: 40 }}>Módulo em desenvolvimento...</div>;
    }
  };

  return (
    <div className="crm-app">
      {/* Sidebar */}
      <aside className="crm-sidebar">
        <div className="crm-logo-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.jpg" alt="D'Luigi Reservas" style={{ width: '120px', borderRadius: '8px' }} />
        </div>
        
        <div className="crm-menu">
          <span className="menu-group">MENU</span>
          <button className={`menu-btn ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={`menu-btn ${activeView === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveView('pipeline')}>
            <Columns size={18} /> Pipeline
          </button>
          <button className={`menu-btn ${activeView === 'leads' ? 'active' : ''}`} onClick={() => setActiveView('leads')}>
            <Users size={18} /> Leads
          </button>
          <button className={`menu-btn ${activeView === 'templates' ? 'active' : ''}`} onClick={() => setActiveView('templates')}>
            <FileText size={18} /> Templates
          </button>
          <button className={`menu-btn ${activeView === 'produtos' ? 'active' : ''}`} onClick={() => setActiveView('produtos')}>
            <Package size={18} /> Produtos
          </button>
          <button className={`menu-btn ${activeView === 'ajuda' ? 'active' : ''}`} onClick={() => setActiveView('ajuda')}>
            <HelpCircle size={18} /> Ajuda
          </button>
        </div>

        <div className="crm-footer">
          <button className="menu-btn logout" onClick={handleLogout}>
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="crm-main">
        <header className="crm-topbar">
          <div className="topbar-left">
            <LayoutDashboard size={20} color="#8B0000" />
            <h1 style={{ textTransform: 'capitalize' }}>CRM</h1>
          </div>
          {session?.user?.email && <div className="user-email">{session.user.email}</div>}
        </header>

        <div className="crm-content-area">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
