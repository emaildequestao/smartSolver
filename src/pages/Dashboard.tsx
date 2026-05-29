import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  AlertCircle, 
  CheckCircle, 
  Search, 
  LogOut, 
  LogIn, 
  LayoutDashboard, 
  Lock, 
  ShieldCheck 
} from 'lucide-react'; 
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
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token_smartsolver')); 
  const [listaOriginal, setListaOriginal] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [categoria, setCategoria] = useState('');
  const [importancia, setImportancia] = useState('');
  const [busca, setBusca] = useState('');

  const fetchComplaints = async () => {
    const token = localStorage.getItem('token_smartsolver');
    if (!token) {
        setIsLoggedIn(false);
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

      if (!res.ok) throw new Error();
      
      const data = await res.json();
      setListaOriginal(data.items || []);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Erro de conexão:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token_smartsolver');
    setIsLoggedIn(false);
    setListaOriginal([]);
    navegar('/login');
  };

  const normalizarString = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const listaFiltrada = useMemo(() => {
    if (!isLoggedIn) return [];
    let resultado = [...listaOriginal];

    if (busca) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter(item => 
        item.complaint_title.toLowerCase().includes(termo) ||
        item.complaint_description.toLowerCase().includes(termo)
      );
    }
    if (categoria) {
      resultado = resultado.filter(item =>
        normalizarString(item.complaint_category || '') === normalizarString(categoria)
      );
    }
    if (importancia) {
      resultado = resultado.filter(item => item.complaint_importance.toString() === importancia);
    }
    
    return resultado;
  }, [busca, categoria, importancia, listaOriginal, isLoggedIn]);

  useEffect(() => { 
    setPage(1); 
  }, [busca, categoria, importancia, listaOriginal]);

  const totalPages = Math.ceil(listaFiltrada.length / PER_PAGE) || 1;
  const itensExibidos = listaFiltrada.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (!isLoggedIn) {
    return (
      <div className="restricted-layout">
        <div className="glass-card central-lock">
          <Lock size={40} className="lock-main-icon" />
          <h2>Área Restrita</h2>
          <p>Por favor, realize o login corporativo para acessar os dados da SmartSolver.</p>
          <button className="action-btn" onClick={() => navegar('/login')}>
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <span className="logo-text">SmartSolver</span>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-group">
              <label>Sistema</label>
              <button className="nav-item active">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
            </div>

            <div className="nav-group">
              <label>Administração</label>
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

              <button className="nav-item success" onClick={() => navegar('/solved_complaints')}>
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
            <h1>Dashboard</h1>
            <p>Gestão de Reclamações Ativa</p>
          </div>
          <div className="user-badge admin">
            <ShieldCheck size={14} />
            Admin Corporativo
          </div>
        </header>

        <main className="content-area">
          <div className="filter-card">
            <div className="search-grid">
              <div className="input-container">
                <Search size={18} className="icon-search" />
                <input 
                  type="text" 
                  placeholder="Pesquisar reclamações..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Categorias</option>
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
              <div className="loader">Sincronizando base de dados...</div>
            ) : itensExibidos.length === 0 ? (
              <div className="loader">Nenhuma reclamação encontrada.</div>
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
                  
                  <div className="card-footer-status">
                    <span className={`dash-status-pill ${item.complaint_status ? 'resolvido' : 'pendente'}`}>
                      {item.complaint_status ? 'Resolvido' : 'Pendente'}
                    </span>
                    <button className="action-btn-dash" onClick={() => navegar(`/complaint/${item.id}`)}>
                      Analisar Detalhes
                    </button>
                  </div>
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
