import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  LayoutDashboard, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react'; 
import ImportantComplaint from '../components/ImportantComplaint';
import '../styles/dashboard.css'; 

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
const PER_PAGE = 6;

export default function ImportantComplaints() {
  const navegar = useNavigate();
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUrgentes = async () => {
    setLoading(true);
    try {
      // Busca filtrada por importância 5 diretamente na API
      const url = `${API_URL}/latest?importance=5&n=${PER_PAGE}&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();
      setLista(data.items || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Erro ao buscar urgências:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUrgentes(); 
  }, [page]);

  return (
    <div className="layout">
      {/* Sidebar idêntica ao Dashboard para manter continuidade */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-text">SmartSolver</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group">
            <label>Navegação</label>
            <button className="nav-item" onClick={() => navegar('/')}>
              <LayoutDashboard size={18} />
              <span>Dashboard Geral</span>
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
          <h1>Reclamações Urgentes</h1>
        </header>

        <main className="content-area">
          {/* Banner de status de prioridade máxima */}
          <div className="filter-card" style={{ borderLeft: '4px solid var(--danger)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <AlertCircle color="var(--danger)" size={24} />
            <div>
              <h3 style={{ color: 'white', fontSize: '1rem' }}>Fila de Prioridade Máxima</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Exibindo apenas protocolos com nível de urgência 5.</p>
            </div>
          </div>

          {/* Grid de cards utilizando a mesma estrutura do Dashboard */}
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
                  complaint_importance={item.importance || item.complaint_importance}
                  complaint_title={item.complaint_title}
                  complaint_description={item.complaint_description}
                />
              ))
            )}
          </div>

          {/* Barra de paginação harmônica */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button 
                className="pag-btn" 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                disabled={page === 1 || loading}
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="page-count">Página {page} de {totalPages}</span>
              
              <button 
                className="pag-btn" 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages || loading}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
