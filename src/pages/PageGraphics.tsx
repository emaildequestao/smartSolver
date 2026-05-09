import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LineChart, PieChart, BarChart3} from 'lucide-react';
import LineC from '../components/Graphic_line';
import Pie from '../components/Graphic_pie';
import OriginBarChart from '../components/Graphic_bar';
import '../styles/graphics.css';

const GRAPHS = [
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
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está autenticado antes de mostrar os gráficos
    const token = localStorage.getItem('token_smartsolver');
    
    if (!token) {
      // Se não houver token, manda para o login
      navegar('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [navegar]);

  // Enquanto verifica o token, não renderiza nada ou mostra um loader
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
        {GRAPHS.map(({ id, title, icon, component }) => (
          <section key={id} className="graph-glass-card">
            <div className="graph-card-header">
              <span className="graph-icon-wrapper">{icon}</span>
              <h3 className="graph-card-title">{title}</h3>
            </div>
            <div className="graph-card-body">
              {/* Passamos o token como prop para os componentes de gráfico caso eles precisem fazer fetch */}
              {component}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
