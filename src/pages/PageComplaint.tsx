import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Send, Trash2, ChevronLeft } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="complaint-page-layout">
        <div className="loader-container">
          <div className="loader-spinner"></div>
          <span>Carregando registro...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-page-layout">
      <header className="complaint-header">
        <button className="back-button" onClick={() => navegacao('/dashboard')}>
          <ChevronLeft size={20} /> Dashboard
        </button>
        <div className="status-indicator">
          <ShieldCheck size={16} />
          <span>Análise em Curso</span>
        </div>
      </header>

      <main className="complaint-main-content">
        {!reclamacao ? (
          <div className="error-card">
            <Lock size={48} />
            <h2>Acesso Restrito</h2>
            <p>Protocolo não localizado ou você não tem permissão para visualizá-lo.</p>
            <button className="primary-btn" onClick={() => navegacao('/dashboard')}>Voltar</button>
          </div>
        ) : (
          <div className="content-wrapper">
            <Complaint
              complaintTitle={reclamacao.complaint_title}
              complaintText={reclamacao.complaint_description}
              complaintsolution={reclamacao.complaint_solution}
              complaintcategory={reclamacao.complaint_category}
              complaintdate={reclamacao.complaint_creation_date}
              complaintorigin={reclamacao.complaint_origin}
              complaintimportance={reclamacao.complaint_importance}
            />

            <section className="feedback-section">
              <h3 className="section-headline">Respostas Técnicas</h3>
              
              <div className="messages-container">
                {comments.length === 0 ? (
                  <div className="empty-state">
                    <p>Ainda não há interações personalizadas neste protocolo.</p>
                  </div>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="message-card">
                      <div className="message-body">
                        <p className="message-text">{c.comment_text}</p>
                        <time className="message-date">
                          {new Date(c.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </time>
                      </div>
                      <button 
                        onClick={() => handleDeleteComment(c.id)} 
                        className="delete-icon-btn"
                        title="Excluir resposta"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="input-box-container">
                <textarea 
                  className="custom-textarea"
                  placeholder="Escreva aqui o parecer técnico ou resposta ao cliente..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="input-footer">
                  <span className="char-count">{newComment.length} caracteres</span>
                  <button 
                    onClick={handleAddComment} 
                    disabled={submitting || !newComment.trim()} 
                    className="submit-button"
                  >
                    {submitting ? 'Enviando...' : (
                      <>
                        <Send size={18} /> Enviar Resposta
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
