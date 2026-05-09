import { useNavigate, useParams } from 'react-router-dom';
import Complaint from './Complaint';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

type Row = {
  complaint_title: string;
  complaint_description: string;
  complaint_creation_date: string;
  complaint_solution: string;
  complaint_category: string;
  complaint_importance: number;
  complaint_origin: string;
  id: string;
};

export default function PageComplaint() {
  const navegacao = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const [reclamacao, setReclamacao] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idParam) return;

    const cached = sessionStorage.getItem(`complaint_${idParam}`);
    if (cached) {
      setReclamacao(JSON.parse(cached));
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/complaint/${idParam}`)
      .then((res) => {
        if (!res.ok) throw new Error('Não encontrado');
        return res.json();
      })
      .then((data) => {
        sessionStorage.setItem(`complaint_${idParam}`, JSON.stringify(data));
        setReclamacao(data);
      })
      .catch(() => setReclamacao(null))
      .finally(() => setLoading(false));
  }, [idParam]);

  if (loading) {
    return (
      <div className="layout">
        <div className="main-container">
          <div className="loader">Sincronizando registro...</div>
        </div>
      </div>
    );
  }

  if (!reclamacao) {
    return (
      <div className="layout">
        <div className="main-container">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <p>Protocolo não localizado</p>
            <button className="pag-btn" onClick={() => navegacao(-1)} style={{ marginTop: '20px' }}>
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Complaint
      complaintTitle={reclamacao.complaint_title}
      complaintText={reclamacao.complaint_description}
      complaintsolution={reclamacao.complaint_solution}
      complaintcategory={reclamacao.complaint_category}
      complaintdate={reclamacao.complaint_creation_date}
      complaintorigin={reclamacao.complaint_origin}
      complaintimportance={reclamacao.complaint_importance}
    />
  );
}
