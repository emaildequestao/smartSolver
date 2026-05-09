import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import '../styles/login.css';

export default function Login() {
  const navegar = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login
    console.log('Dados enviados:', { email, password });
    navegar('/dashboard');
  };

  return (
    <div className="login-layout">
      <div className="login-card">
        <header className="login-header">
          <span className="logo-text">SmartSolver</span>
          <p>Acesse sua central de resoluções</p>
        </header>

        <form className="login-form" onSubmit={handleLogin}>
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
              />
            </div>
          </div>

          <button type="submit" className="btn-login">
            <div className="btn-content">
              <span>Entrar no Sistema</span>
              <LogIn size={20} />
            </div>
          </button>
        </form>

        <footer className="login-footer">
          <a href="#forgot">Esqueceu sua senha?</a>
        </footer>
      </div>
    </div>
  );
}
