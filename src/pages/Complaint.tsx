import React, { useState } from 'react';
import '../styles/dashboard.css';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

function FormattedText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>
      {lines.map((line, i) => {
        if (line.startsWith('### '))  return <h3 key={i} style={{ margin: '15px 0 10px' }}>{parseInline(line.slice(4))}</h3>;
        if (line.startsWith('* '))    return <li key={i} style={{ marginLeft: '20px' }}>{parseInline(line.slice(2))}</li>;
        if (line.trim() === '')       return <br key={i} />;
        return <p key={i} style={{ marginBottom: '10px' }}>{parseInline(line)}</p>;
      })}
    </div>
  );
}

// Corrigido o tipo de retorno para React.ReactNode de forma robusta
function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} style={{ color: 'var(--accent)' }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const [datePart, , timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) + (timePart ? ` às ${timePart}` : '');
  } catch { return dateStr; }
}

type ComplaintProps = {
  complaintTitle: string;
  complaintText: string;
  complaintStatus: boolean; // Substituído de 'complaintsolution' para boolean
  complaintcategory: string;
  complaintdate: string;
  complaintorigin: string;
  complaintimportance: number;
  onToggleStatus: () => Promise<void>; // Gatilho de mutação controlado pela página pai
};

export default function Complaint({
  complaintTitle,
  complaintText,
  complaintStatus,
  complaintcategory,
  complaintdate,
  complaintorigin,
  complaintimportance,
  onToggleStatus,
}: ComplaintProps) {
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);

  const handleGenerateSolution = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: complaintTitle, text: complaintText }),
      });
      const data = await res.json();
      setSolution(data.solution);
    } catch {
      setSolution('Erro ao gerar análise.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    setStatusLoading(true);
    try {
      await onToggleStatus();
    } catch (e) {
      alert("Não foi possível atualizar o status no servidor.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="layout">
      <div className="main-container">
        <header className="main-header" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="pag-btn" onClick={() => window.history.back()}>← Voltar</button>
          <h1>Recomendações</h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px', alignItems: 'start' }}>
          
          <div className="glass-card">
            <div className="card-header">
              <span className="category-pill">{complaintcategory}</span>
              <span className="priority-indicator">Nível {complaintimportance}</span>
            </div>
            
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>{complaintTitle}</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: '40px' }}>{complaintText}</p>

            {solution && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '15px', border: '1px solid var(--border-ui)', marginBottom: '30px' }}>
                <label style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>Análise Inteligente</label>
                <div style={{ marginTop: '15px' }}>
                  <FormattedText text={solution} />
                </div>
              </div>
            )}

            <button className="action-btn" onClick={handleGenerateSolution} disabled={loading} style={{ width: 'auto', padding: '12px 40px' }}>
              {loading ? "Sincronizando..." : "Gerar Solução com IA"}
            </button>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card">
              <h4 style={{ color: 'var(--text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>Informações</h4>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '5px' }}>DATA DO REGISTRO</label>
                <p style={{ fontWeight: '500' }}>{formatDate(complaintdate)}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '5px' }}>ORIGEM DO CANAL</label>
                <p style={{ fontWeight: '500' }}>{complaintorigin || 'Não informada'}</p>
              </div>

              {/* Seção de Status Refatorada com Botão Switch integrado */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)' }}>STATUS DO PROTOCOLO</label>
                
                <div className={`pg-status-indicator ${complaintStatus ? 'resolvido' : 'pendente'}`}>
                  {complaintStatus ? 'Resolvido' : 'Pendente'}
                </div>

                <button 
                  className="pg-switch-btn" 
                  onClick={handleStatusChange}
                  disabled={statusLoading}
                  style={{ width: '100%', marginTop: '5px' }}
                >
                  {statusLoading ? 'Atualizando...' : `Mudar para ${complaintStatus ? 'Pendente' : 'Resolvido'}`}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
