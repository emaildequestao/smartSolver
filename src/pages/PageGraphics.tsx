import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LineChart, PieChart, BarChart3, X, Maximize2 } from 'lucide-react';
import LineC from '../components/Graphic_line';
import Pie from '../components/Graphic_pie';
import OriginBarChart from '../components/Graphic_bar';
import '../styles/graphics.css';

interface GraphItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const GRAPHS: GraphItem[] = [
  { 
    id: 'line',  
    title: 'Evolução Temporal',      
    icon: <LineChart size={18} />, 
    component: <LineC /> 
  },
  { 
    id: 'pie',   
    title: 'Distribuição por Categoria', 
    icon: <PieChart size={18} />, 
    component: <Pie /> 
  },
  { 
    id: 'bar', 
    title: 'Reclamações por Origem', 
    icon: <BarChart3 size={18} />, 
    component: <OriginBarChart /> 
  }
];

export default function PageGraphics() {
  const navegar = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  // Estado para armazenar o gráfico atualmente expandido
  const [activeGraph, setActiveGraph] = useState<GraphItem | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token_smartsolver');
    
    if (!token) {
      navegar('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [navegar]);

  if (!isAuthorized) {
    return null; 
  }

  return (
    <div className="graphics-layout">
      <header className="graphics-header">
        <button className="back-button" onClick={() => navegar('/dashboard')}>
          <ArrowLeft size={20} />
          <span>Painel Principal</span>
        </button>
        <div className="header-title-group">
          <h1>Gráficos Analíticos</h1>
          <span className="corp-badge">Acesso Admin</span>
        </div>
      </header>

      <main className="graphics-main">
        {GRAPHS.map((graph) => (
          <section 
            key={graph.id} 
            className="graph-glass-card"
            onClick={() => setActiveGraph(graph)}
          >
            <div className="graph-card-header">
              <div className="header-left">
                <span className="graph-icon-wrapper">{graph.icon}</span>
                <h3 className="graph-card-title">{graph.title}</h3>
              </div>
              <span className="expand-hint">
                <Maximize2 size={14} />
              </span>
            </div>
            <div className="graph-card-body">
              {graph.component}
            </div>
          </section>
        ))}
      </main>

      {/* Modal de Visualização Expandida */}
      {activeGraph && (
        <div className="modal-overlay" onClick={() => setActiveGraph(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <div className="modal-title-group">
                <span className="graph-icon-wrapper">{activeGraph.icon}</span>
                <h2>{activeGraph.title}</h2>
              </div>
              <button className="close-button" onClick={() => setActiveGraph(null)}>
                <X size={20} />
                <span>Fechar</span>
              </button>
            </header>
            <div className="modal-body">
              {activeGraph.component}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
