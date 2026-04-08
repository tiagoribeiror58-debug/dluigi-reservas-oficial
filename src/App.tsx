import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import Header from '@/components/layout/Header';
import Home from '@/pages/Index';
import SuccessScreen from '@/components/landing/SuccessScreen';
import AdminLogin from '@/pages/AdminLogin';
import CRMLayout from '@/components/crm/CRMLayout';
import Footer from '@/components/layout/Footer';

type Screen = 'home' | 'success' | 'admin-login' | 'admin';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(false);

  const isAdminRoute = window.location.pathname === '/admin';

  useEffect(() => {
    if (!isAdminRoute) return;

    setCheckingAuth(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setScreen(session ? 'admin' : 'admin-login');
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setScreen('admin');
      } else if (isAdminRoute) {
        setScreen('admin-login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReserveClick = () => {
    if (screen !== 'home') {
      setScreen('home');
    } else {
      const el = document.getElementById('form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSuccess = () => {
    setScreen('success');
    window.scrollTo(0, 0);
  };

  const handleNewReservation = () => {
    setScreen('home');
    window.scrollTo(0, 0);
  };

  if (isAdminRoute && checkingAuth) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--cream)' }}>
        <p style={{ color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif" }}>Verificando acesso...</p>
      </div>
    );
  }

  return (
    <>
      {screen !== 'admin' && screen !== 'admin-login' && (
        <Header onReserveClick={handleReserveClick} />
      )}
      {screen === 'home' && <Home onSuccess={handleSuccess} />}
      {screen === 'success' && (
        <>
          <SuccessScreen onNewReservation={handleNewReservation} />
          <Footer />
        </>
      )}
      {screen === 'admin-login' && <AdminLogin />}
      {screen === 'admin' && <CRMLayout session={session} />}
    </>
  );
}

export default App;
