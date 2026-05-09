import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, AlertCircle, Search } from 'lucide-react'; 
import LoadButton from '../components/LoadButton';
import LoadDataButton from '../components/LoadDataButton';
import type { Complaint } from '../types/complaint';
import '../styles/dashboard.css';

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

const IMPORTANCIAS = [1, 2, 3, 4, 5];

export default function Dashboard() {
  const navegar = useNavigate();
  
  // Estados de dados
  const [listaOriginal, setListaOriginal] = useState<Complaint[]>([]);
  const [listaFiltrada, setListaFiltrada] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados de controle dos filtros
  const [page, setPage] = useState(1);
  const [categoria, setCategoria] = useState('');
  const [importancia, setImportancia] = useState('');
  const [busca, setBusca] = useState('');

  // Busca inicial dos dados na API
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/latest?n=100`);
      const data = await res.json();
      const items = data.items || [];
      setListaOriginal(items);
      setListaFiltrada(items);
    } catch (err) {
      console.error("Erro na busca:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Lógica de Filtragem Reativa (Front-end)
  useEffect(() => {
    let resultado = [...listaOriginal];

    if (busca) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter(item => 
        item.complaint_title.toLowerCase().includes(termo) ||
        item.complaint_description.toLowerCase().includes(termo)
      );
    }

    if (categoria) {
      resultado = resultado.filter(item => item.complaint_category === categoria);
    }

    if (importancia) {
      resultado = resultado.filter(item => item.complaint_importance.toString() === importancia);
    }

    setListaFiltrada(resultado);
    setPage(1); // Volta para a página 1 ao filtrar
  }, [busca, categoria, importancia, listaOriginal]);

  // Paginação da lista filtrada
  const totalPages = Math.ceil(listaFiltrada.length / PER_PAGE) || 1;
  const offset = (page - 1) * PER_PAGE;
  const itensExibidos = listaFiltrada.slice(offset, offset + PER_PAGE);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-text">SmartSolver</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <label>Gerenciamento</label>
            <LoadButton setLista={setListaOriginal} />
            <LoadDataButton setLista={setListaOriginal} />
          </div>

          <div className="nav-group">
            <label>Análise</label>
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
          <h1>Dashboard</h1>
        </header>

        <main className="content-area">
          <div className="filter-card">
            <div className="search-grid">
              <div className="input-container">
                <Search size={18} className="icon-search" />
                <input 
                  type="text" 
                  placeholder="Pesquisar protocolos..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas Categorias</option>
                {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select value={importancia} onChange={(e) => setImportancia(e.target.value)}>
                <option value="">Prioridade</option>
                {IMPORTANCIAS.map(num => <option key={num} value={num.toString()}>Nível {num}</option>)}
              </select>
            </div>
          </div>

          <div className="complaints-grid">
            {loading ? (
              <div className="loader">Sincronizando registros...</div>
            ) : itensExibidos.length === 0 ? (
                <div className="loader">Nenhum protocolo encontrado.</div>
            ) : (
              itensExibidos.map((item) => (
                <div key={item.id} className="glass-card">
                  <div className="card-header">
                    <span className="category-pill">{item.complaint_category}</span>
                    <span className={`priority-indicator p-${item.complaint_importance}`}>
                      Lv. {item.complaint_importance}
                    </span>
                  </div>
                  <h4>{item.complaint_title}</h4>
                  <p>{item.complaint_description.substring(0, 100)}...</p>
                  <button className="action-btn" onClick={() => navegar(`/complaint/${item.id}`)}>
                    Analisar Protocolo
                  </button>
                </div>
              ))
            )}
          </div>

          {listaFiltrada.length > PER_PAGE && (
            <div className="pagination-bar">
              <button 
                className="pag-btn" 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
              >
                Anterior
              </button>
              <span className="page-count">Página {page} de {totalPages}</span>
              <button 
                className="pag-btn" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
              >
                Próxima
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
