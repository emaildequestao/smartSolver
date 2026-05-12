import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  LayoutDashboard, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  ShieldAlert
} from 'lucide-react'; 
import ImportantComplaint from '../components/ImportantComplaint';
import '../styles/dashboard.css'; 

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
const PER_PAGE = 6; // Define que queremos 6 itens por página

export default function ImportantComplaints() {
  const navegar = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleLogout = () => {
    localStorage.removeItem('token_smartsolver');
    navegar('/login');
  };

  const fetchUrgentes = async () => {
    const token = localStorage.getItem('token_smartsolver');
    
    if (!token) {
      navegar('/login');
      return;
    }

    setLoading(true);
    try {
      // Ajuste na URL para garantir que pedimos a quantidade correta por página
      const url = `${API_URL}/latest?importance=5&limit=${PER_PAGE}&page=${page}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      
      // Mapeia os dados garantindo que o array de itens exista
      const items = data.items || data || [];
      setLista(Array.isArray(items) ? items : []);
      
      // Calcula o total de páginas baseado no retorno da API ou no tamanho da lista
      setTotalPages(data.pages || Math.ceil((data.total || items.length) / PER_PAGE) || 1);
      setIsAuthorized(true);
    } catch (err) {
      console.error("Erro ao buscar urgências:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUrgentes(); 
  }, [page]);

  if (!isAuthorized && !loading) return null;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <span className="logo-text">SmartSolver</span>
            <span className="corp-tag">CORP</span>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-group">
              <label>Navegação</label>
              <button className="nav-item" onClick={() => navegar('/dashboard')}>
                <LayoutDashboard size={18} />
                <span>Dashboard Geral</span>
              </button>
              <button className="nav-item" onClick={() => navegar('/graphics')}>
                <BarChart3 size={18} />
                <span>Gráficos Analíticos</span>
              </button>
            </div>
            <div className="nav-group">
              <label>Filtro Ativo</label>
              <button className="nav-item warning active">
                <AlertCircle size={18} />
                <span>Urgentes</span>
              </button>
            </div>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      <div className="main-container">
        <header className="main-header">
          <div className="header-info">
            <h1>Reclamações Urgentes</h1>
            <p>Protocolos Nível 5</p>
          </div>
          <div className="user-badge danger">
            <ShieldAlert size={14} />
            Acesso Crítico
          </div>
        </header>

        <main className="content-area">
          <div className="filter-card urgent-banner">
            <AlertCircle color="var(--danger)" size={24} />
            <div>
              <h3>Fila de Prioridade Máxima</h3>
              <p>Visualizando apenas dados sensíveis com urgência máxima.</p>
            </div>
          </div>

          <div className="complaints-grid">
            {loading ? (
              <div className="loader">Sincronizando protocolos críticos...</div>
            ) : lista.length === 0 ? (
              <div className="loader">Nenhum protocolo crítico pendente.</div>
            ) : (
              lista.map((item) => (
                <ImportantComplaint
                  key={item.id}
                  id={item.id}
                  complaint_importance={5} // Como é a página de urgentes, forçamos nível 5
                  complaint_title={item.complaint_title}
                  complaint_description={item.complaint_description}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination-bar">
              <button 
                className="pag-btn" 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                disabled={page === 1 || loading}
              >
                <ChevronLeft size={20} /> Anterior
              </button>
              <span className="page-count">Página {page} de {totalPages}</span>
              <button 
                className="pag-btn" 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages || loading}
              >
                Próxima <ChevronRight size={20} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
