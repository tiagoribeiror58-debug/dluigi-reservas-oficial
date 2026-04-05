import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';
import Header from './components/Header';
import Home from './components/Home';
import SuccessScreen from './components/SuccessScreen';
import AdminLogin from './components/AdminLogin';
import CRMLayout from './crm/CRMLayout';
import Footer from './components/Footer';

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
