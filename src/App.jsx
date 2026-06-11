import React, { useState } from 'react';
import { useStore } from './hooks/useStore';
import PlanScreen    from './screens/PlanScreen';
import ShopScreen    from './screens/ShopScreen';
import HistoryScreen from './screens/HistoryScreen';

const TABS = [
  { key:'plan', label:'Planificar', emoji:'📋' },
  { key:'shop', label:'Comprar',    emoji:'🛒' },
  { key:'hist', label:'Historial',  emoji:'🕐' },
];

export default function App() {
  const [tab, setTab] = useState('plan');
  const store = useStore();

  const pending = store.items.filter(i => i.qty > 0).length;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', maxWidth:480, margin:'0 auto', position:'relative' }}>

      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'calc(var(--safe-top) + 10px) 16px 10px',
        borderBottom:'0.5px solid var(--border)',
        background:'var(--bg)',
        flexShrink:0,
      }}>
        <div>
          <div style={{ fontSize:17, fontWeight:600, color:'var(--text)' }}>🛒 Mercado Familiar</div>
          <div style={{ fontSize:11, color:'var(--text3)', marginTop:1 }}>{weekLabel()}</div>
        </div>
        {pending > 0 && (
          <div style={{ background:'var(--green-bg)', border:'0.5px solid var(--green-bd)', color:'var(--green)', borderRadius:'var(--radius-full)', padding:'3px 10px', fontSize:12, fontWeight:500 }}>
            {pending} items
          </div>
        )}
      </div>

      {/* Screen */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {tab === 'plan' && (
          <PlanScreen
            items={store.items}
            changeQty={store.changeQty}
            updateItem={store.updateItem}
            deleteItem={store.deleteItem}
            addItem={store.addItem}
            resetWeek={store.resetWeek}
            saveWeekToHistory={store.saveWeekToHistory}
          />
        )}
        {tab === 'shop' && (
          <ShopScreen
            items={store.items}
            toggleCart={store.toggleCart}
            updateItem={store.updateItem}
            deleteItem={store.deleteItem}
            addItem={store.addItem}
          />
        )}
        {tab === 'hist' && (
          <HistoryScreen
            history={store.history}
            restoreWeek={store.restoreWeek}
            deleteWeek={store.deleteWeek}
          />
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div style={{
        display:'flex',
        borderTop:'0.5px solid var(--border)',
        background:'var(--bg)',
        paddingBottom:'var(--safe-bottom)',
        flexShrink:0,
      }}>
        {TABS.map(t => {
          const active = tab === t.key;
          const badge  = t.key === 'shop' ? pending : t.key === 'hist' ? store.history.length : 0;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex:1, padding:'8px 4px 6px',
                display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                background: active ? 'var(--green-bg)' : 'transparent',
                border:'none', cursor:'pointer',
                borderTop: active ? '2px solid var(--green)' : '2px solid transparent',
                transition:'all .15s',
                position:'relative',
              }}
            >
              <span style={{ fontSize:20 }}>{t.emoji}</span>
              <span style={{ fontSize:10, fontWeight: active ? 600 : 400, color: active ? 'var(--green)' : 'var(--text3)' }}>
                {t.label}
              </span>
              {badge > 0 && (
                <span style={{
                  position:'absolute', top:6, right:'calc(50% - 18px)',
                  background: t.key==='shop' ? 'var(--green)' : 'var(--bg3)',
                  color: t.key==='shop' ? '#fff' : 'var(--text2)',
                  fontSize:9, fontWeight:600,
                  padding:'1px 5px', borderRadius:'var(--radius-full)',
                  minWidth:16, textAlign:'center',
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function weekLabel() {
  const d = new Date();
  const ms = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `Semana del ${d.getDate()} ${ms[d.getMonth()]} ${d.getFullYear()}`;
}
