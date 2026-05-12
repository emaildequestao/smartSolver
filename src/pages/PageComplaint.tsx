import { useNavigate, useParams } from 'react-router-dom';
import Complaint from './Complaint';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import '../styles/pagecomplaint.css';

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
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Verificação de Identidade Corporativa
    const token = localStorage.getItem('token_smartsolver');
    
    if (!token) {
      navegacao('/login');
      return;
    }

    if (!idParam) return;

    // 2. Checagem de Cache (Opcional, mas mantida com segurança)
    const cached = sessionStorage.getItem(`complaint_${idParam}`);
    if (cached) {
      setReclamacao(JSON.parse(cached));
      setIsAuthorized(true);
      setLoading(false);
      return;
    }

    // 3. Busca Protegida com Header Authorization
    fetch(`${API_URL}/complaint/${idParam}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('token_smartsolver');
          navegacao('/login');
          return;
        }
        if (!res.ok) throw new Error('Não encontrado');
        return res.json();
      })
      .then((data) => {
        sessionStorage.setItem(`complaint_${idParam}`, JSON.stringify(data));
        setReclamacao(data);
        setIsAuthorized(true);
      })
      .catch(() => setReclamacao(null))
      .finally(() => setLoading(false));
  }, [idParam, navegacao]);

  // Se não estiver autorizado, não renderiza o conteúdo
  if (!isAuthorized && !loading) return null;

  if (loading) {
    return (
      <div className="layout">
        <div className="main-container">
          <div className="loader">Sincronizando registro seguro...</div>
        </div>
      </div>
    );
  }

  if (!reclamacao) {
    return (
      <div className="layout">
        <div className="main-container">
          <header className="main-header" style={{ marginBottom: '30px' }}>
            <button className="back-button" onClick={() => navegacao('/dashboard')} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={20} />
              <span>Voltar ao Dashboard</span>
            </button>
          </header>
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
            <Lock size={48} color="var(--text-dim)" style={{ marginBottom: '20px' }} />
            <p style={{ marginBottom: '20px' }}>O protocolo solicitado não foi localizado ou você não possui permissão para acessá-lo.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
       {/* Barra superior de contexto para manter o padrão visual corporativo */}
       <div style={{ position: 'absolute', top: '20px', right: '40px', display: 'flex', gap: '15px' }}>
          <div className="user-badge admin">
            <ShieldCheck size={14} />
            Análise em Curso
          </div>
       </div>
       
       <Complaint
          complaintTitle={reclamacao.complaint_title}
          complaintText={reclamacao.complaint_description}
          complaintsolution={reclamacao.complaint_solution}
          complaintcategory={reclamacao.complaint_category}
          complaintdate={reclamacao.complaint_creation_date}
          complaintorigin={reclamacao.complaint_origin}
          complaintimportance={reclamacao.complaint_importance}
        />
    </div>
  );
}
