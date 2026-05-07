import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard } from 'lucide-react'; 
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
      const url = `${API_URL}/latest?importance=5&n=${PER_PAGE}&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();
      setLista(data.items || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUrgentes(); }, [page]);

  return (
    <div className="layout">
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
          {/* O SEGREDO ESTÁ NESTA SECTION ABAIXO (A mesma do Dashboard) */}
          <section className="complaint-section">
            <div className="reclamation-header">
              <h3>Lista de Prioridades</h3>
            </div>

            <div className="complaints-container">
              {loading ? (
                <div className="status-box">Carregando...</div>
              ) : lista.length === 0 ? (
                <div className="status-box">Nenhuma reclamação urgente encontrada.</div>
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

            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading}>&lt;</button>
              <span className="page-info">Página {page} de {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>&gt;</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
