import '../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';

interface ComplaintProps {
  id: string;
  complaint_title: string;
  complaint_description: string;
  complaint_importance: number;
  complaint_category?: string; // Adicionado para manter o padrão visual
}

export default function ImportantComplaint(props: ComplaintProps) {
  const navegar = useNavigate();
  const carregarbotao = (id: string) => navegar(`/complaint/${id}`);

  // Se não for importância 5, não renderiza nada (mantendo sua lógica original)
  if (props.complaint_importance !== 5) {
    return null;
  }

  return (
    <div className="glass-card">
      <div className="card-header">
        {/* Usando a pill e o indicador de prioridade do CSS original */}
        <span className="category-pill">{props.complaint_category || "Urgente"}</span>
        <span className={`priority-indicator p-${props.complaint_importance}`}>
          Lv. {props.complaint_importance}
        </span>
      </div>

      <h4>{props.complaint_title}</h4>
      
      {/* Aplicando a formatação de texto do dashboard (limite de caracteres para não quebrar o card) */}
      <p>
        {props.complaint_description.length > 150 
          ? `${props.complaint_description.substring(0, 150)}...` 
          : props.complaint_description}
      </p>

      {/* Usando a classe action-btn para manter o estilo do botão azul/roxo */}
      <button className="action-btn" onClick={() => carregarbotao(props.id)}>
        Analisar Protocolo
      </button>
    </div>
  );
}
