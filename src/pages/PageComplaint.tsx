import { useNavigate, useParams } from 'react-router-dom';
import Complaint from './Complaint';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, Send, Trash2 } from 'lucide-react';
import '../styles/pagecomplaint.css';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

type Comment = {
  id: string;
  comment_text: string;
  created_at: string;
};

type Row = {
  id: string;
  complaint_title: string;
  complaint_description: string;
  complaint_creation_date: string;
  complaint_solution: string;
  complaint_category: string;
  complaint_importance: number;
  complaint_origin: string;
  comments?: Comment[]; // Assumindo que venham aqui ou em fetch separado
};

export default function PageComplaint() {
  const navegacao = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const [reclamacao, setReclamacao] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Estados para a nova funcionalidade de comentários
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
      .then((res) => res.json())
      .then((data) => {
        setReclamacao(data);
        setComments(data.comments || []); // Ajuste conforme seu retorno de API
        setIsAuthorized(true);
      })
      .catch(() => setReclamacao(null))
      .finally(() => setLoading(false));
  }, [idParam, navegacao]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    const token = localStorage.getItem('token_smartsolver');

    try {
      const res = await fetch(`${API_URL}/comments_post`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ complaint_id: idParam, text: newComment })
      });
      if (res.ok) {
        const savedComment = await res.json();
        setComments([...comments, savedComment]);
        setNewComment('');
      }
    } catch (err) {
      console.error("Erro ao postar comentário", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem('token_smartsolver');
    try {
      const res = await fetch(`${API_URL}/comments_delete`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ comment_id: commentId })
      });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (err) {
      console.error("Erro ao deletar", err);
    }
  };

  if (!isAuthorized && !loading) return null;
  if (loading) return <div className="layout"><div className="loader">Sincronizando...</div></div>;
  if (!reclamacao) return <div className="layout"><div className="main-container">Erro ao carregar.</div></div>;

  return (
    <div className="layout">
       <div className="context-badge-container">
          <div className="user-badge admin">
            <ShieldCheck size={14} /> Análise em Curso
          </div>
       </div>
       
       <div className="main-container">
          <button className="back-button-styled" onClick={() => navegacao('/dashboard')}>
            <ArrowLeft size={20} /> Voltar
          </button>

          <Complaint
            complaintTitle={reclamacao.complaint_title}
            complaintText={reclamacao.complaint_description}
            complaintsolution={reclamacao.complaint_solution}
            complaintcategory={reclamacao.complaint_category}
            complaintdate={reclamacao.complaint_creation_date}
            complaintorigin={reclamacao.complaint_origin}
            complaintimportance={reclamacao.complaint_importance}
          />

          {/* SEÇÃO DE RESPOSTAS PERSONALIZADAS */}
          <section className="comments-section">
            <h3 className="section-title">Respostas Internas</h3>
            
            <div className="comments-list">
              {comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-content">
                    <p>{c.comment_text}</p>
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => handleDeleteComment(c.id)} className="delete-btn">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="comment-input-area">
              <textarea 
                placeholder="Escreva uma resposta personalizada..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button 
                onClick={handleAddComment} 
                disabled={submitting}
                className="send-btn"
              >
                {submitting ? 'Enviando...' : <><Send size={18} /> Enviar Resposta</>}
              </button>
            </div>
          </section>
       </div>
    </div>
  );
}
