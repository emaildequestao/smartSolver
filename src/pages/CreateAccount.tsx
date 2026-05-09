import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, Loader2, ArrowLeft } from 'lucide-react';
import '../styles/login.css';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

export default function CreateAccount() {
  const navegar = useNavigate();
  
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    // Validação básica de senha no front-end
    if (password !== confirmPassword) {
      setErro('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/create_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Cadastro realizado com sucesso, envia para o login
        alert('Conta criada com sucesso! Faça seu login.');
        navegar('/login');
      } else {
        setErro(data.detail || 'Erro ao criar conta. Verifique os dados.');
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
          <p className="sub-tag">Cadastro de Novo Administrador</p>
        </div>

        <form className="login-form-body" onSubmit={handleRegister}>
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
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div className="input-field">
              <Lock size={18} className="field-icon" />
              <input 
                type="password" 
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Confirmar Senha</label>
            <div className="input-field">
              <Lock size={18} className="field-icon" />
              <input 
                type="password" 
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="action-stack">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (
                <Loader2 className="spinning" size={20} />
              ) : (
                <>
                  <span>Finalizar Cadastro</span>
                  <UserPlus size={20} />
                </>
              )}
            </button>

            <button 
              type="button" 
              className="secondary-btn" 
              onClick={() => navegar('/login')}
              disabled={loading}
            >
              <ArrowLeft size={18} />
              <span>Voltar para Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
