import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LineChart, PieChart, BarChart3 } from 'lucide-react';
import LineC from '../components/Graphic_line';
import Pie from '../components/Graphic_pie';
import OriginBarChart from '../components/Graphic_bar';
import '../styles/graphics.css';

// Configuração dos gráficos mantendo os componentes originais
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

  return (
    <div className="graphics-layout">
      {/* Header com o nome original e ícone de retorno */}
      <header className="graphics-header">
        <button className="back-button" onClick={() => navegar(-1)}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <h2>Gráficos Analíticos</h2>
      </header>

      {/* Grid com espaçamentos corrigidos */}
      <main className="graphics-main">
        {GRAPHS.map(({ id, title, icon, component }) => (
          <section key={id} className="graph-glass-card">
            <div className="graph-card-header">
              <span className="graph-icon-wrapper">{icon}</span>
              <h3 className="graph-card-title">{title}</h3>
            </div>
            <div className="graph-card-body">
              {component}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
