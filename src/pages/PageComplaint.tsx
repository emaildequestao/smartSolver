import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Send, Trash2, ChevronLeft, MessageSquare } from 'lucide-react';
import Complaint from './Complaint';
import '../styles/pagecomplaint.css';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

type Comment = { id: string; text: string; author_email: string; created_at: string; };
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

  if (loading) return (
    <div className="pg-complaint-wrapper">
      <div className="pg-loader">Carregando protocolo...</div>
    </div>
  );

  return (
    <div className="pg-complaint-wrapper">
      <div className="pg-container">
        
        <header className="pg-header">
          <button className="pg-back-btn" onClick={() => navegacao('/dashboard')}>
            <ChevronLeft size={18} /> Painel Geral
          </button>
          <div className="pg-badge-status">
            <ShieldCheck size={14} /> Análise em Curso
          </div>
        </header>

        {!reclamacao ? (
          <div className="pg-error-card">
            <Lock size={40} />
            <p>Protocolo não encontrado.</p>
            <button onClick={() => navegacao('/dashboard')}>Voltar</button>
          </div>
        ) : (
          <main className="pg-content">
            {/* Componente de Reclamação */}
            <div className="pg-card-wrapper">
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

            {/* Seção de Respostas Técnicas */}
            <section className="pg-comments-section">
              <div className="pg-section-header">
                <MessageSquare size={20} />
                <h3>Respostas Técnicas Personalizadas</h3>
              </div>

              <div className="pg-comments-list">
                {comments.length === 0 ? (
                  <div className="pg-empty-box">Nenhuma resposta registrada.</div>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="pg-comment-card">
                      <div className="pg-comment-info">
                        <p>{c.text}</p>
                        <span>{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <button className="pg-delete-btn" onClick={() => handleDeleteComment(c.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pg-input-wrapper">
                <textarea 
                  placeholder="Escreva sua análise técnica..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="pg-input-actions">
                  <small>{newComment.length} caracteres</small>
                  <button 
                    className="pg-send-btn"
                    onClick={handleAddComment} 
                    disabled={submitting || !newComment.trim()}
                  >
                    <Send size={16} /> {submitting ? 'Enviando...' : 'Adicionar Resposta'}
                  </button>
                </div>
              </div>
            </section>

          </main>
        )}
      </div>
    </div>
  );
}
