/* --- VARIÁVEIS TEMA --- */
:root {
  --bg-deep: #0f172a;        
  --bg-card: #1e293b;        
  --accent: #6366f1;         
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --danger: #f43f5e;
  --glass: rgba(255, 255, 255, 0.03);
  --border-ui: rgba(255, 255, 255, 0.1);
  --radius: 20px;
  --ease: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
body { background: var(--bg-deep); color: var(--text-main); overflow-x: hidden; }

/* --- LAYOUT --- */
.layout { display: flex; min-height: 100vh; }

.sidebar {
  width: 260px;
  background: #0a0f1d;
  padding: 40px 24px;
  border-right: 1px solid var(--border-ui);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.main-container { flex: 1; padding: 40px 60px; }

/* --- SIDEBAR COMPONENTS --- */
.sidebar-header { margin-bottom: 40px; display: flex; align-items: center; gap: 10px; }
.logo-text { font-size: 1.5rem; font-weight: 800; color: white; }
.corp-tag { background: var(--accent); font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; }

.nav-group label { color: var(--text-dim); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin: 20px 0 10px; }

.nav-item {
  width: 100%; border: none; background: transparent; padding: 12px;
  border-radius: 12px; color: var(--text-dim); display: flex; align-items: center;
  gap: 12px; cursor: pointer; transition: var(--ease); font-weight: 500;
}

.nav-item:hover, .nav-item.active { background: var(--accent); color: white; }
.nav-item.warning.active { background: var(--danger); color: white; }

/* --- GRID DE RECLAMAÇÕES --- */
.complaints-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
  gap: 24px;
  margin-top: 20px;
}

/* --- CARDS --- */
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-ui);
  border-radius: var(--radius);
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: var(--ease);
  min-height: 220px;
}

.glass-card:hover { transform: translateY(-5px); border-color: var(--accent); }

/* --- FILTROS E DROPDOWNS --- */
.search-grid select {
  background: #0f172a;
  color: white;
  border: 1px solid var(--border-ui);
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  appearance: auto;
}

.search-grid select option { background: var(--bg-card); color: white; }

/* --- BANNER DE URGÊNCIA --- */
.urgent-banner {
  border-left: 4px solid var(--danger);
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--bg-card);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 30px;
}

.urgent-banner h3 { color: white; margin-bottom: 4px; }
.urgent-banner p { color: var(--text-dim); font-size: 0.9rem; }

/* --- HEADER E BADGES --- */
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.user-badge { display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
.user-badge.danger { background: rgba(244, 63, 94, 0.1); color: var(--danger); border: 1px solid var(--danger); }

/* --- PAGINAÇÃO --- */
.pagination-bar { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 50px; }
.pag-btn { background: var(--bg-card); border: 1px solid var(--border-ui); color: white; padding: 10px 18px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.pag-btn:hover:not(:disabled) { background: var(--accent); }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.loader { width: 100%; text-align: center; padding: 50px; color: var(--text-dim); grid-column: 1 / -1; }

/* --- ADIÇÃO: FEATURE DE RESPOSTA (Não quebra o anterior) --- */
.complaint-card-interactive { justify-content: space-between; gap: 20px; }
.card-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.protocol-id { color: var(--accent); font-size: 0.7rem; font-weight: bold; }
.status-dot-urgent { width: 8px; height: 8px; background: var(--danger); border-radius: 50%; box-shadow: 0 0 10px var(--danger); }

.response-area { border-top: 1px solid var(--border-ui); paddingTop: 15px; margin-top: auto; }
.response-box { background: rgba(99, 102, 241, 0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.1); }
.response-header { display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--accent); font-weight: bold; margin-bottom: 5px; }
.btn-del { background: none; border: none; color: var(--text-dim); cursor: pointer; transition: 0.3s; }
.btn-del:hover { color: var(--danger); }

.reply-form { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
.reply-form textarea { background: var(--bg-deep); border: 1px solid var(--border-ui); border-radius: 10px; color: white; padding: 10px; font-size: 0.8rem; resize: none; min-height: 60px; }
.btn-reply { background: var(--accent); color: white; border: none; padding: 10px; border-radius: 10px; cursor: pointer; font-weight: bold; display: flex; justify-content: center; align-items: center; gap: 10px; transition: 0.3s; }
.btn-reply:hover:not(:disabled) { filter: brightness(1.2); }
.btn-reply:disabled { opacity: 0.5; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
