import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  LayoutDashboard, 
  AlertCircle, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react'; 
import '../styles/solved_complaints.css'; 

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
const PER_PAGE = 6;

export default function SolvedComplaints() {
  const navegar = useNavigate();
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleLogout = () => {
    localStorage.removeItem('token_smartsolver');
    navegar('/login');
  };

  const fetchResolvidas = async () => {
    const token = localStorage.getItem('token_smartsolver');
    if (!token) {
      navegar('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/solved`, {
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
      const resolvidas = data.items || [];
      setLista(resolvidas);
      setTotalPages(Math.ceil(resolvidas.length / PER_PAGE) || 1);
    } catch (err) {
      console.error("Erro ao carregar resolvidas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchResolvidas(); 
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
              <button className="nav-item warning" onClick={() => navegar('/importantcomplaints')}>
                <AlertCircle size={18} />
                <span>Urgentes</span>
              </button>
            </div>
            <div className="nav-group">
              <label>Filtro Ativo</label>
              <button className="nav-item active resolved-nav">
                <CheckCircle size={18} />
                <span>Resolvidos</span>
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
            <h1>Resolvidos</h1>
            <p>Protocolos Concluídos com Sucesso</p>
          </div>
          <div className="user-badge success-badge">
            <CheckCircle size={14} />
            Arquivo Seguro
          </div>
        </header>

        <main className="content-area">
          <div className="filter-card resolved-banner">
            <CheckCircle className="resolved-icon" size={24} />
            <div className="resolved-text">
              <h3>Fila de Casos Solucionados</h3>
              <p>Visualizando apenas ocorrências que já receberam parecer técnico e foram encerradas.</p>
            </div>
          </div>

          <div className="complaints-grid">
            {loading ? (
              <div className="loader">Sincronizando reclamações...</div>
            ) : itensPagina.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={48} opacity={0.15} className="resolved-icon" />
                <p>Nenhuma reclamação resolvida foi encontrada no banco.</p>
              </div>
            ) : (
              itensPagina.map((item) => (
                <div key={item.id} className="glass-card">
                  <div className="card-header">
                    <span className="category-pill">{item.complaint_category || 'Resolvido'}</span>
                    <span className={`priority-indicator p-${item.complaint_importance}`}>
                      Lv. {item.complaint_importance}
                    </span>
                  </div>
                  <h4>{item.complaint_title}</h4>
                  <p>{item.complaint_description?.substring(0, 150)}...</p>
                  <button className="action-btn" onClick={() => navegar(`/complaint/${item.id}`)}>
                    Ver Detalhes
                  </button>
                </div>
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