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
import '../styles/important.css'; 

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
const PER_PAGE = 6;

export default function ImportantComplaints() {
  const navegar = useNavigate();
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      const res = await fetch(`${API_URL}/latest?n=100`, {
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
      const urgentes = (data.items || []).filter((item: any) =>
        (item.complaint_importance || item.importance) === 5
      );
      setLista(urgentes);
      setTotalPages(Math.ceil(urgentes.length / PER_PAGE) || 1);
    } catch (err) {
      console.error("Erro ao carregar urgências:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUrgentes(); 
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(lista.length / PER_PAGE) || 1);
  }, [lista]);

  const itensPagina = lista.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <span className="logo-text">SmartSolver</span>
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
            <h1>Urgentes</h1>
            <p>Reclamações Nível 5</p>
          </div>
          <div className="user-badge danger">
            <ShieldAlert size={14} />
            Acesso Crítico
          </div>
        </header>

        <main className="content-area">
          <div className="filter-card urgency-banner">
            <AlertCircle className="urgency-icon" size={24} />
            <div className="urgency-text">
              <h3>Fila de Prioridade Máxima</h3>
              <p>Visualizando apenas reclamações sensíveis com urgência máxima.</p>
            </div>
          </div>

          <div className="complaints-grid">
            {loading ? (
              <div className="loader">Sincronizando reclamações...</div>
            ) : itensPagina.length === 0 ? (
              <div className="empty-state">
                <ShieldAlert size={48} opacity={0.2} />
                <p>Nenhuma reclamação crítica pendente no momento.</p>
              </div>
            ) : (
              itensPagina.map((item) => (
                <ImportantComplaint
                  key={item.id}
                  id={item.id}
                  complaint_importance={item.complaint_importance || item.importance}
                  complaint_title={item.complaint_title}
                  complaint_description={item.complaint_description}
                />
              ))
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="pagination-bar">
              <button className="pag-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={20} />
              </button>
              <span className="page-count">Página {page} de {totalPages}</span>
              <button className="pag-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}