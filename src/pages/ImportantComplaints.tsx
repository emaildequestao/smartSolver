import { useState } from 'react';
import { MessageSquare, Send, Trash2, Clock, AlertCircle } from 'lucide-react';

interface Props {
  id: string | number;
  complaint_title: string;
  complaint_description: string;
  complaint_importance: number;
  initial_response?: string;
}

export default function ImportantComplaint({ 
  id, 
  complaint_title, 
  complaint_description, 
  initial_response 
}: Props) {
  const [reply, setReply] = useState(initial_response || '');
  const [tempText, setTempText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!initial_response);

  const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('token_smartsolver');

  // Enviar resposta para o banco
  const handlePost = async () => {
    if (!tempText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/coments_post`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ complaintId: id, comment: tempText })
      });

      if (res.ok) {
        setReply(tempText);
        setIsEditing(false);
      } else {
        alert("Erro ao salvar resposta.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remover resposta do banco
  const handleRemove = async () => {
    if (!window.confirm("Deseja apagar esta resposta definitivamente?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/coments_remove`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ complaintId: id })
      });

      if (res.ok) {
        setReply('');
        setTempText('');
        setIsEditing(true);
      }
    } catch (err) {
      console.error("Erro ao remover:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card complaint-card-interactive">
      <div className="card-top">
        <div className="card-header-internal">
          <span className="id-tag">PROTOCOL #{id}</span>
          <div className="importance-dot" />
        </div>
        <h3>{complaint_title}</h3>
        <p className="description">{complaint_description}</p>
      </div>

      <div className="response-section">
        {!isEditing && reply ? (
          <div className="final-reply fade-in">
            <div className="reply-header">
              <span className="official-label">
                <MessageSquare size={12} /> RESPOSTA ENVIADA
              </span>
              <button onClick={handleRemove} className="delete-reply" disabled={loading}>
                <Trash2 size={14} />
              </button>
            </div>
            <p className="reply-content">{reply}</p>
          </div>
        ) : (
          <div className="reply-input-area fade-in">
            <textarea 
              placeholder="Digite a tratativa oficial para este caso..."
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              disabled={loading}
            />
            <button 
              onClick={handlePost} 
              className="send-btn"
              disabled={loading || !tempText.trim()}
            >
              {loading ? <Clock className="spin" size={16} /> : <Send size={16} />}
              {loading ? 'Processando...' : 'Publicar Resposta'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
