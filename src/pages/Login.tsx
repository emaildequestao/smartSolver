import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, UserPlus } from 'lucide-react';
import '../styles/login.css';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

export default function Login() {
  const navegar = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await fetch(`${API_URL}/login_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('token_smartsolver', data.access_token);
        navegar('/dashboard');
      } else {
        setErro(data.detail || 'Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor corporativo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <div className="login-card">
        <header className="login-header">
          <span className="logo-text">SmartSolver</span>
          <p>Acesse sua central de resoluções</p>
        </header>

        <form className="login-form" onSubmit={handleLogin}>
          {erro && <div className="login-error-msg">{erro}</div>}

          <div className="form-group">
            <label htmlFor="email">E-mail Corporativo</label>
            <div className="login-input-wrapper">
              <Mail size={18} />
              <input 
                type="email" 
                id="email" 
                placeholder="nome@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="login-input-wrapper">
              <Lock size={18} />
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-actions">
            <button type="submit" className="btn-login" disabled={loading}>
              <div className="btn-content">
                {loading ? (
                  <Loader2 size={20} className="spinner" />
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <LogIn size={20} />
                  </>
                )}
              </div>
            </button>

            {/* Novo Botão Criar Conta */}
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navegar('/create_account')}
              disabled={loading}
            >
              <div className="btn-content">
                <UserPlus size={18} />
                <span>Criar Conta Corporativa</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
