import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, Send, Trash2 } from 'lucide-react';
import Complaint from './Complaint';
import '../styles/pagecomplaint.css';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

type Comment = { id: string; comment_text: string; created_at: string; };

type Row = {
  id: string; complaint_title: string; complaint_description: string;
  complaint_creation_date: string; complaint_solution: string;
  complaint_category: string; complaint_importance: number;
  complaint_origin: string; comments?: Comment[];
};

export default function PageComplaint() {
  const navegacao = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const [reclamacao, setReclamacao] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token_smartsolver');
    if (!token) { navegacao('/login'); return; }
    if (!idParam) return;

    fetch(`${API_URL}/complaint/${idParam}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setReclamacao(data);
        setComments(data.comments || []);
      })
      .catch(() => setReclamacao(null))
      .finally(() => setLoading(false));
  }, [idParam, navegacao]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/comments_post`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token_smartsolver')}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ complaint_id: idParam, text: newComment })
      });
      if (res.ok) {
        const saved = await res.json();
        setComments([...comments, saved]);
        setNewComment('');
      }
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm("Excluir esta resposta?")) return;
    try {
      const res = await fetch(`${API_URL}/comments_delete`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token_smartsolver')}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ comment_id: id })
      });
      if (res.ok) setComments(comments.filter(c => c.id !== id));
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="layout"><div className="loader">Carregando registro...</div></div>;

  return (
    <div className="layout">
      {/* Badge de Status Fixa */}
      <div className="status-badge-wrapper">
        <div className="user-badge admin">
          <ShieldCheck size={14} /> Análise em Curso
        </div>
      </div>

      <div className="main-container">
        <header className="main-header">
          <button className="back-button-styled" onClick={() => navegacao('/dashboard')}>
            <ArrowLeft size={20} />
            <span>Voltar ao Dashboard</span>
          </button>
        </header>

        {!reclamacao ? (
          <div className="glass-card error-state">
            <Lock size={48} />
            <p>Protocolo não localizado ou acesso negado.</p>
          </div>
        ) : (
          <>
            <Complaint
              complaintTitle={reclamacao.complaint_title}
              complaintText={reclamacao.complaint_description}
              complaintsolution={reclamacao.complaint_solution}
              complaintcategory={reclamacao.complaint_category}
              complaintdate={reclamacao.complaint_creation_date}
              complaintorigin={reclamacao.complaint_origin}
              complaintimportance={reclamacao.complaint_importance}
            />

            <section className="comments-section">
              <h3 className="section-title">Respostas Personalizadas</h3>
              <div className="comments-list">
                {comments.map(c => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-content">
                      <p>{c.comment_text}</p>
                      <small>{new Date(c.created_at).toLocaleDateString()}</small>
                    </div>
                    <button onClick={() => handleDeleteComment(c.id)} className="delete-btn">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="comment-input-area">
                <textarea 
                  placeholder="Digite sua resposta técnica..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleAddComment} disabled={submitting} className="send-btn">
                  <Send size={18} /> {submitting ? 'Enviando...' : 'Enviar Resposta'}
                </button>
              </div>
            </>
          </section>
        )}
      </div>
    </div>
  );
}
