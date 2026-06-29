import React, { useState, useMemo } from 'react';
import { CATEGORIES, STORES, SECTION_MAP, ALDI_SECTIONS } from '../data/items';
import ItemModal from '../components/ItemModal';

const ALL_CATS   = ['Todas', ...Object.keys(CATEGORIES)];
const ALL_STORES = ['Todas', ...STORES];

export default function PlanScreen({ items, changeQty, updateItem, deleteItem, addItem, resetWeek, saveWeekToHistory }) {
  const [search,      setSearch]      = useState('');
  const [filterCat,   setFilterCat]   = useState('Todas');
  const [filterStore, setFilterStore] = useState('Todas');
  const [editingItem, setEditingItem] = useState(null);   // existing item being edited
  const [showAddModal, setShowAddModal] = useState(false); // controls "new product" modal
  const [prefillName, setPrefillName] = useState('');      // name typed in quick-add bar
  const [newName,     setNewName]     = useState('');

  const filtered = useMemo(() => {
    let list = [...items];
    if (filterCat   !== 'Todas') list = list.filter(i => i.cat   === filterCat);
    if (filterStore !== 'Todas') list = list.filter(i => i.store === filterStore);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(i => i.name.toLowerCase().includes(q) || (i.note||'').toLowerCase().includes(q)); }
    return list.sort((a,b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));
  }, [items, filterCat, filterStore, search]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(item => {
      const key = filterCat === 'Todas' ? item.cat : '—';
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return Object.entries(map);
  }, [filtered, filterCat]);

  // ─── Add / Edit handlers ──────────────────────────────────────────────────────
  function openAddModal() {
    setPrefillName(newName.trim());
    setShowAddModal(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
  }

  function closeModals() {
    setShowAddModal(false);
    setEditingItem(null);
    setPrefillName('');
    setNewName('');
  }

  function handleSaveNew(data) {
    addItem(data);          // always goes through addItem for brand-new products
    closeModals();
  }

  function handleSaveEdit(data) {
    updateItem(data.id, data);
    closeModals();
  }

  function handleDelete(id) {
    deleteItem(id);
    closeModals();
  }

  function handleReset() {
    const pending = items.filter(i => i.qty > 0 && !i.inCart).length;
    if (window.confirm(`Reset semanal: los productos comprados vuelven a 0. Los ${pending} pendientes mantienen su cantidad. ¿Confirmar?`)) resetWeek();
  }

  function handleSaveWeek() {
    const r = saveWeekToHistory();
    if (r === 'empty')  alert('Agrega cantidades primero.');
    else if (r === 'exists') alert('Esta semana ya está guardada en el historial.');
    else alert('✅ Semana guardada en historial.');
  }

  const activeCount = items.filter(i => i.qty > 0).length;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'var(--bg)' }}>
      {/* Search */}
      <div style={{ padding:'8px 16px', borderBottom:'0.5px solid var(--border)', display:'flex', gap:8, alignItems:'center' }}>
        <span style={{ color:'var(--text3)', fontSize:15 }}>🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto o nota…"
          style={{ flex:1, border:'none', background:'transparent', color:'var(--text)', fontSize:13, outline:'none' }}
        />
        {search && <button onClick={() => setSearch('')} style={{ color:'var(--text3)', fontSize:18 }}>×</button>}
      </div>

      {/* Category filter */}
      <div className="chip-scroll">
        {ALL_CATS.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} className={`chip${filterCat===c?' active-cat':''}`}>{c}</button>
        ))}
      </div>

      {/* Store filter */}
      <div className="chip-scroll">
        {ALL_STORES.map(s => (
          <button key={s} onClick={() => setFilterStore(s)} className={`chip${filterStore===s?' active-store':''}`}>{s}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {grouped.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 16px', color:'var(--text3)' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
            Sin resultados
          </div>
        )}
        {grouped.map(([cat, catItems]) => (
          <div key={cat}>
            {filterCat === 'Todas' && (
              <div style={{ padding:'6px 16px 3px', fontSize:10, fontWeight:500, color:'var(--text3)', textTransform:'uppercase', letterSpacing:.5, background:'var(--bg2)' }}>
                {cat}
              </div>
            )}
            {catItems.map(item => {
              const zero = item.qty === 0;
              const nonAldi = item.store !== 'Aldi';
              const sec = SECTION_MAP[item.name] ? ALDI_SECTIONS.find(s => s.order === SECTION_MAP[item.name]) : null;
              return (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 16px', borderBottom:'0.5px solid var(--border)' }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', flexShrink:0, background: zero ? 'var(--border2)' : 'var(--green)' }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, color: zero ? 'var(--text3)' : 'var(--text)', display:'flex', alignItems:'center', gap:4, flexWrap:'wrap' }}>
                      {item.name}
                      {nonAldi && <span style={{ fontSize:10, color:'var(--orange)' }}>({item.store})</span>}
                    </div>
                    {item.note && <div style={{ fontSize:10, color:'var(--text3)', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.note}</div>}
                    {sec && !nonAldi && <div style={{ fontSize:10, color:'var(--blue)', marginTop:1 }}>{sec.emoji} {sec.name}</div>}
                  </div>
                  {/* Qty control */}
                  <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
                    <button onClick={() => changeQty(item.id, -1)} style={{ width:26, height:26, borderRadius:'50%', border:'0.5px solid var(--border2)', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>−</button>
                    <span style={{ fontSize:12, fontWeight:500, minWidth:18, textAlign:'center', color: zero ? 'var(--text3)':'var(--text)' }}>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, +1)} style={{ width:26, height:26, borderRadius:'50%', border:'0.5px solid var(--border2)', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>+</button>
                    <span style={{ fontSize:10, color:'var(--text3)', minWidth:22 }}>{item.unit}</span>
                  </div>
                  <button onClick={() => openEditModal(item)} style={{ color:'var(--text3)', fontSize:16, padding:'0 2px' }}>✏️</button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Quick add bar */}
      <div style={{ display:'flex', gap:8, padding:'8px 16px', borderTop:'0.5px solid var(--border)', background:'var(--bg)' }}>
        <input
          value={newName} onChange={e => setNewName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') openAddModal(); }}
          placeholder="Nuevo producto…"
          style={{ flex:1, padding:'8px 10px', border:'0.5px solid var(--border2)', borderRadius:'var(--radius-md)', fontSize:13, background:'var(--bg2)', color:'var(--text)', outline:'none' }}
        />
        <button
          onClick={openAddModal}
          style={{ padding:'8px 14px', background:'var(--green-bg)', border:'0.5px solid var(--green-bd)', color:'var(--green)', borderRadius:'var(--radius-md)', fontSize:12, fontWeight:500 }}
        >
          + Agregar
        </button>
      </div>

      {/* Footer actions */}
      <div style={{ display:'flex', gap:6, padding:'8px 16px', paddingBottom:'calc(8px + var(--safe-bottom))', borderTop:'0.5px solid var(--border)', background:'var(--bg)' }}>
        <FtrBtn onClick={handleReset} label="🔄 Reset semana" />
        <FtrBtn onClick={handleSaveWeek} label="💾 Guardar semana" />
      </div>

      {/* Edit existing item */}
      <ItemModal
        open={!!editingItem}
        item={editingItem}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
        onClose={closeModals}
      />

      {/* Add new item — always a fresh, blank-or-prefilled form, never depends on a fake "item" object */}
      <ItemModal
        open={showAddModal}
        item={prefillName ? { name: prefillName, qty: 1, unit: 'und', cat: ALL_CATS[1], store: 'Aldi', note: '' } : null}
        forceNew
        onSave={handleSaveNew}
        onDelete={() => {}}
        onClose={closeModals}
      />
    </div>
  );
}

function FtrBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{ flex:1, padding:'7px 4px', border:'0.5px solid var(--border2)', borderRadius:'var(--radius-md)', fontSize:11, color:'var(--text2)', background:'transparent' }}>
      {label}
    </button>
  );
}
