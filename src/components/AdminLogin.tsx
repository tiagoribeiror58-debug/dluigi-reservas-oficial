import { useState } from 'react';
import { ADMIN_PASSWORD } from '../constants';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true');
      onSuccess();
    } else {
      setError('Senha incorreta');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={{ maxWidth: '340px', margin: '60px auto', padding: '0 24px' }}>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: '26px',
          fontWeight: 700,
          color: 'var(--red)',
          marginBottom: '24px',
        }}
      >
        Área restrita
      </h2>
      <div className="field">
        <label className="lbl">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="••••••••"
          className={error ? 'err' : ''}
        />
        {error && <p className="err-msg">{error}</p>}
      </div>
      <button className="btn-primary" onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
}
