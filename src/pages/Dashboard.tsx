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
  
  // Estados de Dados
  const [lista, setLista] = useState<Complaint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Estados de Filtro
  const [categoria, setCategoria] = useState('');
  const [importancia, setImportancia] = useState('');
  const [busca, setBusca] = useState('');

  // Função de busca principal
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      // Construção da URL com Query Params
      const params = new URLSearchParams({
        n: PER_PAGE.toString(),
        page: page.toString(),
      });

      if (categoria) params.append('complaintcategory', categoria);
      if (importancia) params.append('complaintimportance', importancia);
      if (busca) params.append('q', busca); // 'q' é o padrão para busca textual

      const res = await fetch(`${API_URL}/latest?${params.toString()}`);
      const data = await res.json();
      
      setLista(data.items || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Erro ao buscar reclamações:", err);
    } finally {
      setLoading(false);
    }
  };

  // Efeito que dispara a busca sempre que um filtro ou a página muda
  useEffect(() => {
    fetchComplaints();
  }, [page, categoria, importancia, busca]);

  const carregarDetalhes = (id: string) => navegar(`/complaint/${id}`);

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
          <h2>Dashboard de Reclamações</h2>
        </header>

        <main className="content-area">
          <section className="complaint-section">
            
            {/* BARRA DE FILTROS COMPLETA */}
            <div className="reclamation-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
              <h3>Filtros de Pesquisa</h3>
              
              <div className="search-filter-container" style={{ display: 'flex', width: '100%', gap: '10px', flexWrap: 'wrap' }}>
                
                {/* Busca por Texto */}
                <div style={{ position: 'relative', flex: '2', minWidth: '250px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
                  <input 
                    type="text"
                    placeholder="Buscar no título ou descrição..."
                    className="filter-btn"
                    style={{ paddingLeft: '35px', width: '100%' }}
                    value={busca}
                    onChange={(e) => { setBusca(e.target.value); setPage(1); }}
                  />
                </div>

                {/* Filtro de Categoria */}
                <select 
                  className="filter-btn" 
                  style={{ flex: '1' }}
                  value={categoria} 
                  onChange={(e) => { setCategoria(e.target.value); setPage(1); }}
                >
                  <option value="">Todas as Categorias</option>
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Filtro de Importância */}
                <select 
                  className="filter-btn" 
                  style={{ flex: '1' }}
                  value={importancia} 
                  onChange={(e) => { setImportancia(e.target.value); setPage(1); }}
                >
                  <option value="">Importância (Todas)</option>
                  {IMPORTANCIAS.map((num) => (
                    <option key={num} value={num.toString()}>Nível {num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* LISTAGEM DE CARDS */}
            <div className="complaints-container">
              {loading ? (
                <div className="status-box">Carregando dados...</div>
              ) : lista.length === 0 ? (
                <div className="status-box">Nenhuma reclamação encontrada para os filtros selecionados.</div>
              ) : (
                lista.map((item) => (
                  <div key={item.id} className="complaint-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="badge">{item.complaintcategory}</span>
                      <span className={`importance-tag level-${item.complaintimportance}`} style={{ fontWeight: 'bold' }}>
                        Nível {item.importance}
                      </span>
                    </div>
                    <h4>{item.complaint_title}</h4>
                    <p className="complaint-description">
                      {item.complaint_description.substring(0, 150)}...
                    </p>
                    <button className="read-more-btn" onClick={() => carregarDetalhes(item.id)}>
                      Analisar Reclamação
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* PAGINAÇÃO */}
            <div className="pagination">
              <button 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                disabled={page === 1 || loading}
              >
                Anterior
              </button>
              <span className="page-info">Página <strong>{page}</strong> de {totalPages}</span>
              <button 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages || loading}
              >
                Próxima
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
