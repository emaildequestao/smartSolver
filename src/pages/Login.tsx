import React, { useState } from 'react';
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
    <div className="login-screen">
      <div className="login-box">
        <div className="login-header">
          <h1 className="logo-brand">SmartSolver</h1>
          <p className="sub-tag">Central de Resoluções Corporativas</p>
        </div>

        <form className="login-form-body" onSubmit={handleLogin}>
          {erro && <div className="error-alert">{erro}</div>}

          <div className="input-group">
            <label>E-mail Corporativo</label>
            <div className="input-field">
              <Mail size={18} className="field-icon" />
              <input 
                type="email" 
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div className="input-field">
              <Lock size={18} className="field-icon" />
              <input 
                type="password" 
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="action-stack">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (
                <Loader2 className="spinning" size={20} />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <LogIn size={20} />
                </>
              )}
            </button>

            <button 
              type="button" 
              className="secondary-btn" 
              onClick={() => navegar('/create_account')}
            >
              <UserPlus size={18} />
              <span>Criar Nova Conta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
