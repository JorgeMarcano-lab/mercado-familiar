import React, { useState, useMemo } from 'react';
import { ALDI_SECTIONS, SECTION_MAP, STORES, DEFAULT_STORE, getSectionOrder } from '../data/items';
import ItemModal from '../components/ItemModal';

const VIEWS = [
  { key:'byroute', label:'🗺 Recorrido' },
  { key:'bystore', label:'🏪 Por tienda' },
  { key:'bycat',   label:'📋 Categoría' },
];

export default function ShopScreen({ items, toggleCart, updateItem, deleteItem }) {
  const [view,  setView]  = useState('byroute');
  const [modal, setModal] = useState(null);

  const shopItems  = useMemo(() => items.filter(i => i.qty > 0), [items]);
  const totalCount = shopItems.length;
  const doneCount  = useMemo(() => shopItems.filter(i => i.inCart).length, [shopItems]);
  const pct        = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Share
  function handleShare() {
    const d = new Date();
    const ms = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    let txt = `🛒 Mercado ${d.getDate()} ${ms[d.getMonth()]}\n`;
    const byStore = {};
    shopItems.forEach(i => { if (!byStore[i.store]) byStore[i.store]=[]; byStore[i.store].push(i); });
    [DEFAULT_STORE, ...STORES.filter(s=>s!==DEFAULT_STORE)].forEach(store => {
      const grp = byStore[store]; if (!grp?.length) return;
      txt += `\n📍 ${store}\n`;
      grp.sort((a,b) => getSectionOrder(a)-getSectionOrder(b) || a.name.localeCompare(b.name))
         .forEach(i => { txt += `${i.inCart?'✅':'⬜'} ${i.name} — ${i.qty} ${i.unit}${i.note?` (${i.note})`:''}\n`; });
    });
    if (navigator.share) navigator.share({ title:'Mercado Familiar', text: txt });
    else { navigator.clipboard.writeText(txt).then(() => alert('¡Lista copiada al portapapeles!')); }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'var(--bg)' }}>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div style={{ padding:'10px 16px 0', borderBottom:'0.5px solid var(--border)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text2)', marginBottom:5 }}>
            <span>Progreso de compra</span><span>{doneCount} / {totalCount}</span>
          </div>
          <div style={{ height:5, borderRadius:4, background:'var(--bg2)', overflow:'hidden', marginBottom:10 }}>
            <div style={{ height:'100%', width:`${pct}%`, background:'var(--green)', borderRadius:4, transition:'width .3s' }} />
          </div>
        </div>
      )}

      {/* View toggle */}
      <div style={{ display:'flex', gap:6, padding:'8px 16px', borderBottom:'0.5px solid var(--border)' }}>
        {VIEWS.map(v => (
          <button key={v.key} onClick={() => setView(v.key)} style={{
            flex:1, padding:'6px 4px', fontSize:11, fontWeight:500,
            borderRadius:'var(--radius-md)', border:'0.5px solid var(--border2)',
            background: view===v.key ? 'var(--blue-bg)' : 'transparent',
            color: view===v.key ? 'var(--blue)' : 'var(--text2)',
            borderColor: view===v.key ? 'var(--blue-bd)' : 'var(--border2)',
          }}>{v.label}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {shopItems.length === 0
          ? <div style={{ textAlign:'center', padding:'48px 16px', color:'var(--text3)' }}><div style={{ fontSize:32, marginBottom:8 }}>🛒</div>Agrega cantidades en Planificar</div>
          : view === 'byroute' ? <RouteView shopItems={shopItems} toggleCart={toggleCart} setModal={setModal} />
          : view === 'bystore' ? <StoreView shopItems={shopItems} toggleCart={toggleCart} setModal={setModal} />
          : <CatView shopItems={shopItems} toggleCart={toggleCart} setModal={setModal} />
        }
      </div>

      {/* Footer */}
      <div style={{ padding:'10px 16px', paddingBottom:'calc(10px + var(--safe-bottom))', borderTop:'0.5px solid var(--border)' }}>
        <button onClick={handleShare} style={{ width:'100%', padding:'10px', background:'var(--green-bg)', border:'0.5px solid var(--green-bd)', color:'var(--green)', borderRadius:'var(--radius-md)', fontSize:13, fontWeight:500 }}>
          📤 Compartir lista
        </button>
      </div>

      <ItemModal
        open={!!modal}
        item={modal}
        onSave={data => { updateItem(data.id, data); setModal(null); }}
        onDelete={id => { deleteItem(id); setModal(null); }}
        onClose={() => setModal(null)}
      />
    </div>
  );
}

function ItemRow({ item, toggleCart, setModal }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', borderBottom:'0.5px solid var(--border)', opacity: item.inCart ? 0.5 : 1 }}>
      <button
        onClick={() => toggleCart(item.id)}
        style={{ width:24, height:24, borderRadius:'50%', border: item.inCart ? 'none' : '1.5px solid var(--border2)', background: item.inCart ? 'var(--green-bg)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:13, color:'var(--green)' }}
      >
        {item.inCart ? '✓' : ''}
      </button>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, color: item.inCart ? 'var(--text3)' : 'var(--text)', textDecoration: item.inCart ? 'line-through' : 'none' }}>{item.name}</div>
        {item.note && <div style={{ fontSize:10, color:'var(--text3)', marginTop:1 }}>{item.note}</div>}
      </div>
      <span style={{ fontSize:12, color:'var(--text2)' }}>{item.qty}</span>
      <span style={{ fontSize:10, color:'var(--text3)', minWidth:24 }}>{item.unit}</span>
      <button onClick={() => setModal(item)} style={{ color:'var(--text3)', fontSize:14 }}>✏️</button>
    </div>
  );
}

function SectionHdr({ sec, done, total }) {
  const allDone = done === total;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:'var(--blue-bg)', borderBottom:'0.5px solid var(--blue-bd)', borderTop:'0.5px solid var(--blue-bd)', marginTop:2 }}>
      <div style={{ width:22, height:22, borderRadius:'50%', background: allDone ? 'var(--green-bg)' : 'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color: allDone ? 'var(--green)' : 'var(--blue)', flexShrink:0 }}>
        {allDone ? '✓' : sec.order}
      </div>
      <span style={{ fontSize:13 }}>{sec.emoji}</span>
      <span style={{ flex:1, fontSize:12, fontWeight:500, color:'var(--blue)' }}>{sec.name}</span>
      <span style={{ fontSize:11, color:'var(--blue)' }}><span style={{ fontWeight:600, color:'var(--green)' }}>{done}</span>/{total}</span>
    </div>
  );
}

function DoneHeader({ count }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 16px', background:'var(--bg2)', borderBottom:'0.5px solid var(--border)', fontSize:11, color:'var(--text2)' }}>
      ✅ En carrito ({count})
    </div>
  );
}

function RouteView({ shopItems, toggleCart, setModal }) {
  const aldiPending  = shopItems.filter(i => !i.inCart && i.store === DEFAULT_STORE);
  const otherPending = shopItems.filter(i => !i.inCart && i.store !== DEFAULT_STORE);
  const done         = shopItems.filter(i => i.inCart);

  const bySection = {};
  aldiPending.forEach(item => {
    const o = SECTION_MAP[item.name] ?? 98;
    if (!bySection[o]) bySection[o] = [];
    bySection[o].push(item);
  });

  const byStore = {};
  otherPending.forEach(i => { if (!byStore[i.store]) byStore[i.store]=[]; byStore[i.store].push(i); });

  return (
    <>
      {Object.keys(bySection).map(Number).sort((a,b)=>a-b).map(order => {
        const grp = bySection[order];
        const sec = ALDI_SECTIONS.find(s => s.order === order) ?? { order, emoji:'📦', name:`Sección ${order}` };
        const secDone = grp.filter(i => i.inCart).length;
        return (
          <div key={order}>
            <SectionHdr sec={sec} done={secDone} total={grp.length} />
            {grp.sort((a,b) => a.name.localeCompare(b.name)).map(item => <ItemRow key={item.id} item={item} toggleCart={toggleCart} setModal={setModal} />)}
          </div>
        );
      })}
      {Object.entries(byStore).map(([store, grp]) => (
        <div key={store}>
          <div style={{ padding:'7px 16px', background:'var(--orange-bg)', borderTop:'0.5px solid var(--orange-bd)', borderBottom:'0.5px solid var(--orange-bd)', fontSize:12, fontWeight:500, color:'var(--orange)', display:'flex', justifyContent:'space-between' }}>
            🏪 {store} <span style={{ fontWeight:400, opacity:.7 }}>{grp.length} producto{grp.length!==1?'s':''}</span>
          </div>
          {grp.map(item => <ItemRow key={item.id} item={item} toggleCart={toggleCart} setModal={setModal} />)}
        </div>
      ))}
      {done.length > 0 && <><DoneHeader count={done.length} />{done.map(item => <ItemRow key={item.id} item={item} toggleCart={toggleCart} setModal={setModal} />)}</>}
    </>
  );
}

function StoreView({ shopItems, toggleCart, setModal }) {
  const pending = shopItems.filter(i => !i.inCart);
  const done    = shopItems.filter(i =>  i.inCart);
  const byStore = {};
  pending.forEach(i => { if (!byStore[i.store]) byStore[i.store]=[]; byStore[i.store].push(i); });
  return (
    <>
      {[DEFAULT_STORE, ...STORES.filter(s=>s!==DEFAULT_STORE)].map(store => {
        const grp = byStore[store]; if (!grp?.length) return null;
        const isAldi = store === DEFAULT_STORE;
        return (
          <div key={store}>
            <div style={{ padding:'7px 16px', background: isAldi?'var(--blue-bg)':'var(--orange-bg)', borderTop:'0.5px solid '+(isAldi?'var(--blue-bd)':'var(--orange-bd)'), borderBottom:'0.5px solid '+(isAldi?'var(--blue-bd)':'var(--orange-bd)'), fontSize:12, fontWeight:500, color: isAldi?'var(--blue)':'var(--orange)', display:'flex', justifyContent:'space-between' }}>
              🏪 {store} <span style={{ fontWeight:400, opacity:.7 }}>{grp.length} producto{grp.length!==1?'s':''}</span>
            </div>
            {grp.sort((a,b)=>getSectionOrder(a)-getSectionOrder(b)||a.name.localeCompare(b.name)).map(item=><ItemRow key={item.id} item={item} toggleCart={toggleCart} setModal={setModal}/>)}
          </div>
        );
      })}
      {done.length>0&&<><DoneHeader count={done.length}/>{done.map(item=><ItemRow key={item.id} item={item} toggleCart={toggleCart} setModal={setModal}/>)}</>}
    </>
  );
}

function CatView({ shopItems, toggleCart, setModal }) {
  const pending = shopItems.filter(i=>!i.inCart).sort((a,b)=>a.cat.localeCompare(b.cat)||a.name.localeCompare(b.name));
  const done    = shopItems.filter(i=> i.inCart);
  const byCat   = {};
  pending.forEach(i=>{if(!byCat[i.cat])byCat[i.cat]=[];byCat[i.cat].push(i);});
  return (
    <>
      {Object.entries(byCat).map(([cat,grp])=>(
        <div key={cat}>
          <div style={{padding:'5px 16px 3px',fontSize:10,fontWeight:500,color:'var(--text3)',textTransform:'uppercase',letterSpacing:.5,background:'var(--bg2)'}}>{cat}</div>
          {grp.map(item=><ItemRow key={item.id} item={item} toggleCart={toggleCart} setModal={setModal}/>)}
        </div>
      ))}
      {done.length>0&&<><DoneHeader count={done.length}/>{done.map(item=><ItemRow key={item.id} item={item} toggleCart={toggleCart} setModal={setModal}/>)}</>}
    </>
  );
}
