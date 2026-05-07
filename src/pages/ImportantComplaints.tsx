import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard } from 'lucide-react'; 
import ImportantComplaint from '../components/ImportantComplaint';
import '../styles/dashboard.css'; 

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

export default function ImportantComplaints() {
  const navegar = useNavigate();
  
  // Estados para dados e controle de carregamento
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Função para buscar dados da API filtrando apenas por importância 5
  const fetchUrgentes = async () => {
    setLoading(true);
    try {
      // Ajuste o endpoint conforme a necessidade do seu backend
      const url = `${API_URL}/latest?importance=5`;
      const res = await fetch(url);
      const data = await res.json();
      
      // Assume que a API retorna um objeto com uma lista 'items'
      setLista(data.items || []);
    } catch (err) {
      console.error("Erro ao buscar reclamações urgentes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados ao montar o componente
  useEffect(() => {
    fetchUrgentes();
  }, []);

  return (
    <div className="layout">
      {/* Sidebar - Herdando o estilo escuro do dashboard.css */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-text">Painel Geral</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <label>Navegação</label>
            <button className="nav-item" onClick={() => navegar('/')}>
              <LayoutDashboard size={18} />
              <span>Voltar ao Dashboard</span>
            </button>
            <button className="nav-item" onClick={() => navegar('/graphics')}>
              <BarChart3 size={18} />
              <span>Gráficos Analíticos</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="main-container">
        <header className="main-header">
          <h2>Reclamações Urgentes</h2>
        </header>

        <main className="content-area">
          <div className="complaints-container">
            {loading ? (
              <div className="status-box">Carregando prioridades...</div>
            ) : lista.length === 0 ? (
              <div className="status-box">Nenhuma reclamação urgente encontrada.</div>
            ) : (
              lista.map((item) => (
                <ImportantComplaint
                  key={item.id}
                  id={item.id}
                  // Garante compatibilidade com diferentes nomes de campos vindos da API
                  complaint_importance={item.importance || item.complaint_importance}
                  complaint_title={item.complaint_title}
                  complaint_description={item.complaint_description}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
