import '../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BarChart3, AlertCircle } from 'lucide-react'; 
import LoadButton from '../components/LoadButton';
import LoadDataButton from '../components/LoadDataButton';
import type { Complaint } from '../types/complaint';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
const PER_PAGE = 6;

const CATEGORIAS = [
  "Cobrança Indevida", 
  "Problemas de Pagamento", 
  "Conta Bloqueada", 
  "Resgate de Investimento Não Realizado", 
  "Problemas de Atendimento",
  "Vítima de golpe",
  "Outros"
];

export default function Dashboard() {
  const navegar = useNavigate();
  const [lista, setLista] = useState<Complaint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 1. Novo estado para a categoria
  const [categoria, setCategoria] = useState('');

  // 2. Atualização da função de busca para incluir a categoria
  const fetchComplaints = async (p: number, cat: string) => {
    setLoading(true);
    try {
      // Adicionamos o parâmetro category na URL (ajuste conforme o nome esperado pelo seu backend)
      const url = `${API_URL}/latest?n=${PER_PAGE}&page=${p}${cat ? `&category=${encodeURIComponent(cat)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setLista(data.items);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. O useEffect agora escuta mudanças na página E na categoria
  useEffect(() => {
    fetchComplaints(page, categoria);
  }, [page, categoria]);

  const carregarbotao = (id: string) => navegar(`/complaint/${id}`);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-text">Painel Geral</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <label>Ações</label>
            <LoadButton setLista={setLista} />
            <LoadDataButton setLista={setLista} />
          </div>

          <div className="nav-group">
            <label>Visualização</label>
            <button className="nav-item" onClick={() => navegar('/graphics')}>
              <BarChart3 size={18} />
              <span>Gráficos Analíticos</span>
            </button>
            <button className="nav-item warning" onClick={() => navegar('/importantcomplaints')}>
              <AlertCircle size={18} />
              <span>Urgentes</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="main-container">
        <header className="main-header">
          <h2>Dashboard</h2>
        </header>

        <main className="content-area">
          <section className="complaint-section">
            <div className="reclamation-header">
              <h3>Reclamações</h3>
              <div className="search-filter-container">
                {/* 4. Substituição do Input/Botão pela tag Select */}
                <select 
                  className="filter-btn" 
                  value={categoria} 
                  onChange={(e) => {
                    setCategoria(e.target.value);
                    setPage(1); // Reseta para a primeira página ao filtrar
                  }}
                >
                  <option value="">Todas as Categorias</option>
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="complaints-container">
              {loading ? (
                <div className="status-box">Carregando...</div>
              ) : lista.length === 0 ? (
                <div className="status-box">Nenhuma reclamação encontrada nesta categoria.</div>
              ) : (
                lista.map((reclamacao) => (
                  <div key={reclamacao.id} className="complaint-card">
                    <h4>{reclamacao.complaint_title}</h4>
                    {/* Exibindo a categoria no card para conferência */}
                    <span className="badge">{reclamacao.category}</span>
                    <p className="complaint-description">{reclamacao.complaint_description}</p>
                    <button className="read-more-btn" onClick={() => carregarbotao(reclamacao.id)}>
                      Ler mais e obter recomendações
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>&lt;</button>
              <span className="page-info">Página {page} de {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>&gt;</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
