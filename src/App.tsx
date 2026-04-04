import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import SuccessScreen from './components/SuccessScreen';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

type Screen = 'home' | 'success' | 'admin-login' | 'admin';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const auth = localStorage.getItem('admin_auth') === 'true';
    setIsAuthenticated(auth);
    if (auth && screen === 'admin-login') {
      setScreen('admin');
    }
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setScreen('admin');
    } else {
      setScreen('admin-login');
    }
  };

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

  const handleAdminLoginSuccess = () => {
    setIsAuthenticated(true);
    setScreen('admin');
  };

  return (
    <>
      <Header onAdminClick={handleAdminClick} onReserveClick={handleReserveClick} />
      {screen === 'home' && <Home onSuccess={handleSuccess} />}
      {screen === 'success' && (
        <>
          <SuccessScreen onNewReservation={handleNewReservation} />
          <Footer />
        </>
      )}
      {screen === 'admin-login' && <AdminLogin onSuccess={handleAdminLoginSuccess} />}
      {screen === 'admin' && <AdminDashboard />}
    </>
  );
}

export default App;
