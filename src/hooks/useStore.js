import { useState, useEffect, useCallback } from 'react';
import { buildInitialItems, DEFAULT_STORE } from '../data/items';

const KEY_ITEMS   = 'mf:items';
const KEY_HISTORY = 'mf:history';
const KEY_NEXTID  = 'mf:nextId';

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

let _nextId = load(KEY_NEXTID, 2000);

export function useStore() {
  const [items,   setItems]   = useState(() => load(KEY_ITEMS, buildInitialItems()));
  const [history, setHistory] = useState(() => load(KEY_HISTORY, []));

  useEffect(() => { save(KEY_ITEMS, items); },   [items]);
  useEffect(() => { save(KEY_HISTORY, history); }, [history]);

  const newId = useCallback(() => {
    _nextId += 1; save(KEY_NEXTID, _nextId); return _nextId;
  }, []);

  const changeQty = useCallback((id, delta) =>
    setItems(p => p.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)), []);

  const toggleCart = useCallback((id) =>
    setItems(p => p.map(i => i.id === id ? { ...i, inCart: !i.inCart } : i)), []);

  const updateItem = useCallback((id, patch) =>
    setItems(p => p.map(i => i.id === id ? { ...i, ...patch } : i)), []);

  const deleteItem = useCallback((id) =>
    setItems(p => p.filter(i => i.id !== id)), []);

  const addItem = useCallback((data) => {
    setItems(prev => {
      const ex = prev.find(i => i.name.toLowerCase() === data.name.toLowerCase());
      if (ex) return prev.map(i => i.id === ex.id ? { ...i, qty: Math.max(i.qty, 1) } : i);
      return [...prev, { id: newId(), name: data.name, qty: data.qty ?? 1, unit: data.unit ?? 'und', cat: data.cat ?? 'Snacks & Otros', store: data.store ?? DEFAULT_STORE, note: data.note ?? '', inCart: false }];
    });
  }, [newId]);

  const resetWeek = useCallback(() =>
    setItems(p => p.map(i => i.inCart ? { ...i, qty: 0, inCart: false } : i)), []);

  const saveWeekToHistory = useCallback(() => {
    const active = items.filter(i => i.qty > 0);
    if (!active.length) return 'empty';
    const d = new Date();
    const ms = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    const label = `Semana del ${d.getDate()} ${ms[d.getMonth()]}`;
    if (history.find(w => w.label === label)) return 'exists';
    setHistory(p => [{ id:'w'+Date.now(), label, date: d.toISOString(), products: active.map(i => ({ name:i.name, qty:i.qty, unit:i.unit, cat:i.cat, store:i.store, note:i.note, bought:i.inCart })) }, ...p]);
    return 'ok';
  }, [items, history]);

  const restoreWeek = useCallback((weekId) => {
    const week = history.find(w => w.id === weekId);
    if (!week) return;
    setItems(prev => {
      const next = [...prev];
      week.products.forEach(p => {
        const idx = next.findIndex(i => i.name === p.name);
        if (idx >= 0) next[idx] = { ...next[idx], qty: p.qty, store: p.store, note: p.note, inCart: false };
        else next.push({ id: newId(), name: p.name, qty: p.qty, unit: p.unit, cat: p.cat, store: p.store ?? DEFAULT_STORE, note: p.note, inCart: false });
      });
      return next;
    });
  }, [history, newId]);

  const deleteWeek = useCallback((weekId) =>
    setHistory(p => p.filter(w => w.id !== weekId)), []);

  return { items, history, changeQty, toggleCart, updateItem, deleteItem, addItem, resetWeek, saveWeekToHistory, restoreWeek, deleteWeek };
}
