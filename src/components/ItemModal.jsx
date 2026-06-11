import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CATEGORIES, STORES, DEFAULT_STORE, SECTION_MAP, ALDI_SECTIONS } from '../data/items';

const CATS = Object.keys(CATEGORIES);

export default function ItemModal({ open, item, onSave, onDelete, onClose }) {
  const [name,  setName]  = useState('');
  const [qty,   setQty]   = useState(1);
  const [unit,  setUnit]  = useState('und');
  const [cat,   setCat]   = useState(CATS[0]);
  const [store, setStore] = useState(DEFAULT_STORE);
  const [note,  setNote]  = useState('');

  useEffect(() => {
    if (item) { setName(item.name); setQty(item.qty); setUnit(item.unit); setCat(item.cat); setStore(item.store); setNote(item.note ?? ''); }
    else      { setName(''); setQty(1); setUnit('und'); setCat(CATS[0]); setStore(DEFAULT_STORE); setNote(''); }
  }, [item, open]);

  function handleSave() {
    const n = name.trim(); if (!n) return;
    onSave({ ...(item ?? {}), name: n, qty: Math.max(0, Number(qty) || 0), unit: unit.trim() || 'und', cat, store, note: note.trim() });
  }

  const secOrder = SECTION_MAP[name];
  const sec = secOrder ? ALDI_SECTIONS.find(s => s.order === secOrder) : null;

  return (
    <Modal open={open} onClose={onClose} title={item ? 'Editar producto' : 'Nuevo producto'}>
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Name */}
        <Field label="Nombre">
          <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del producto" autoFocus={!item} />
        </Field>

        {sec && (
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--blue-bg)', borderRadius:8, padding:'5px 10px', alignSelf:'flex-start' }}>
            <span>{sec.emoji}</span>
            <span style={{ fontSize:11, color:'var(--blue)' }}>ALDI · {sec.name}</span>
          </div>
        )}

        {/* Qty + Unit */}
        <div style={{ display:'flex', gap:10 }}>
          <Field label="Cantidad" style={{ flex:1 }}>
            <input style={inp} type="number" min="0" value={qty} onChange={e => setQty(e.target.value)} />
          </Field>
          <Field label="Unidad" style={{ flex:1 }}>
            <input style={inp} value={unit} onChange={e => setUnit(e.target.value)} placeholder="und, paq, lata…" />
          </Field>
        </div>

        {/* Category */}
        <Field label="Categoría">
          <div className="chip-scroll" style={{ margin:'0 -16px', padding:'6px 16px' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`chip${cat===c?' active-cat':''}`}>{c}</button>
            ))}
          </div>
        </Field>

        {/* Store */}
        <Field label="Tienda">
          <div className="chip-scroll" style={{ margin:'0 -16px', padding:'6px 16px', borderBottom:'none' }}>
            {STORES.map(s => (
              <button key={s} onClick={() => setStore(s)} className={`chip${store===s?' active-store':''}`}>
                {s}{s === DEFAULT_STORE ? ' ✓' : ''}
              </button>
            ))}
          </div>
        </Field>

        {/* Note */}
        <Field label="Nota">
          <textarea style={{ ...inp, minHeight:72, resize:'vertical' }} value={note} onChange={e => setNote(e.target.value)} placeholder="Ej: solo si están duritos, en Key Foods…" />
        </Field>

        {/* Buttons */}
        <button onClick={handleSave} style={{ ...btn, background:'var(--green-bg)', color:'var(--green)', border:'0.5px solid var(--green-bd)' }}>
          Guardar
        </button>
        {item && (
          <button onClick={() => { if (window.confirm(`¿Eliminar "${item.name}"?`)) onDelete(item.id); }} style={{ ...btn, color:'var(--red)', border:'0.5px solid var(--red-bd)' }}>
            🗑 Eliminar producto
          </button>
        )}
      </div>
    </Modal>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={style}>
      <div style={{ fontSize:11, color:'var(--text2)', marginBottom:4 }}>{label}</div>
      {children}
    </div>
  );
}

const inp = {
  width:'100%', padding:'8px 10px',
  border:'0.5px solid var(--border2)',
  borderRadius:'var(--radius-md)',
  fontSize:13, background:'var(--bg2)', color:'var(--text)',
  outline:'none',
};
const btn = {
  width:'100%', padding:'10px',
  borderRadius:'var(--radius-md)',
  fontSize:13, fontWeight:500,
  border:'0.5px solid var(--border2)',
  background:'transparent', color:'var(--text2)',
};
