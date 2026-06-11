import React, { useState, useMemo } from 'react';
import { STORES, DEFAULT_STORE } from '../data/items';

export default function HistoryScreen({ history, restoreWeek, deleteWeek }) {
  const [expanded, setExpanded] = useState(null);

  const topItems = useMemo(() => {
    const freq = {};
    history.forEach(w => w.products.filter(p => p.bought).forEach(p => { freq[p.name] = (freq[p.name] ?? 0) + 1; }));
    return Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 3);
  }, [history]);

  if (!history.length) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:10, color:'var(--text3)', padding:32, textAlign:'center' }}>
        <div style={{ fontSize:40 }}>🕐</div>
        <div style={{ fontSize:13 }}>Aún no hay semanas guardadas.<br /><br />Usa "💾 Guardar semana" en la pestaña Planificar.</div>
      </div>
    );
  }

  return (
    <div style={{ background:'var(--bg)', height:'100%', overflowY:'auto' }}>

      {/* Top purchased */}
      {topItems.length > 0 && (
        <>
          <div style={{ padding:'12px 16px 6px', fontSize:10, fontWeight:500, color:'var(--text3)', textTransform:'uppercase', letterSpacing:.5 }}>Lo más comprado</div>
          <div style={{ display:'flex', gap:8, padding:'0 16px 14px' }}>
            {topItems.map(([name, count]) => (
              <div key={name} style={{ flex:1, background:'var(--bg2)', borderRadius:'var(--radius-md)', padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:20, fontWeight:600, color:'var(--text)' }}>{count}x</div>
                <div style={{ fontSize:10, color:'var(--text2)', marginTop:2 }}>{name}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Week cards */}
      {history.map(week => {
        const bought = week.products.filter(p => p.bought).length;
        const missed = week.products.filter(p => !p.bought).length;
        const isOpen = expanded === week.id;

        const byStore = {};
        week.products.forEach(p => { const s = p.store ?? DEFAULT_STORE; if (!byStore[s]) byStore[s]=[]; byStore[s].push(p); });

        return (
          <div key={week.id} style={{ margin:'0 16px 10px', border:'0.5px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
            {/* Header */}
            <button
              onClick={() => setExpanded(isOpen ? null : week.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', padding:'11px 14px', background:'var(--bg2)', gap:8, textAlign:'left' }}
            >
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:'var(--text)' }}>{week.label}</div>
                <div style={{ fontSize:11, color:'var(--text3)', marginTop:1 }}>{week.products.length} productos</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:10, padding:'2px 8px', borderRadius:'var(--radius-full)', background:'var(--green-bg)', color:'var(--green)' }}>✓ {bought}</span>
                {missed > 0 && <span style={{ fontSize:10, padding:'2px 8px', borderRadius:'var(--radius-full)', background:'var(--bg3)', color:'var(--text2)' }}>✗ {missed}</span>}
                <span style={{ color:'var(--text3)', fontSize:13 }}>{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Expanded */}
            {isOpen && (
              <>
                {[DEFAULT_STORE, ...STORES.filter(s=>s!==DEFAULT_STORE)].map(store => {
                  const grp = byStore[store]; if (!grp?.length) return null;
                  return (
                    <div key={store}>
                      <div style={{ padding:'4px 14px', fontSize:10, fontWeight:500, color:'var(--text3)', textTransform:'uppercase', letterSpacing:.4, background:'var(--bg2)', borderTop:'0.5px solid var(--border)' }}>{store}</div>
                      {grp.map(p => (
                        <div key={p.name} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 14px', borderBottom:'0.5px solid var(--border)', fontSize:12 }}>
                          <span style={{ color: p.bought ? 'var(--green)' : 'var(--red)', fontSize:13 }}>{p.bought ? '✓' : '✗'}</span>
                          <span style={{ flex:1, color:'var(--text)' }}>{p.name}</span>
                          <span style={{ color:'var(--text3)' }}>{p.qty} {p.unit}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}

                {/* Actions */}
                <div style={{ display:'flex', gap:8, padding:'10px 14px', background:'var(--bg2)', borderTop:'0.5px solid var(--border)' }}>
                  <button
                    onClick={() => { if (window.confirm(`¿Cargar "${week.label}" como base de esta semana?`)) restoreWeek(week.id); }}
                    style={{ flex:1, padding:'7px', border:'0.5px solid var(--blue-bd)', borderRadius:'var(--radius-md)', fontSize:12, color:'var(--blue)', background:'transparent' }}
                  >
                    🔄 Usar como base
                  </button>
                  <button
                    onClick={() => { if (window.confirm(`¿Eliminar "${week.label}" del historial?`)) deleteWeek(week.id); }}
                    style={{ flex:1, padding:'7px', border:'0.5px solid var(--red-bd)', borderRadius:'var(--radius-md)', fontSize:12, color:'var(--red)', background:'transparent' }}
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}

      <div style={{ height: 'calc(16px + var(--safe-bottom))' }} />
    </div>
  );
}
