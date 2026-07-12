import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { buildInitialItems, DEFAULT_STORE } from '../data/items';

const CACHE_KEY = 'mf:cache'; // copia local de respaldo (modo sin conexion)
const DOC_ID = 'familia';     // un solo documento compartido por toda la familia

function loadCache(fallback) {
  try { const v = localStorage.getItem(CACHE_KEY); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function saveCache(val) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(val)); } catch {}
}
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function useStore() {
  const cache = loadCache({ items: buildInitialItems(), history: [] });
  const [items, setItemsLocal] = useState(cache.items);
  const [history, setHistoryLocal] = useState(cache.history);
  const initializedRemote = useRef(false);
  const docRef = doc(db, 'listas', DOC_ID);

  // Copia local de respaldo: se actualiza con cualquier cambio (propio o remoto)
  useEffect(() => { saveCache({ items, history }); }, [items, history]);

  // Escucha en tiempo real: cualquier cambio de cualquier familiar llega aqui
  useEffect(() => {
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setItemsLocal(data.items ?? []);
        setHistoryLocal(data.history ?? []);
      } else if (!initializedRemote.current) {
        initializedRemote.current = true;
        setDoc(docRef, { items: buildInitialItems(), history: [] });
      }
    }, (err) => {
      console.error('Sin conexion con la nube, usando copia local:', err);
    });
    return unsub;
  }, []);

  const persist = useCallback((patch) => {
    setDoc(docRef, patch, { merge: true }).catch((err) =>
      console.error('No se pudo guardar en la nube (se guardo localmente):', err)
    );
  }, []);

  const setItems = useCallback((updater) => {
    setItemsLocal((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persist({ items: next });
      return next;
    });
  }, [persist]);

  const setHistory = useCallback((updater) => {
    setHistoryLocal((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persist({ history: next });
      return next;
    });
  }, [persist]);

  const changeQty = useCallback((id, delta) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))), [setItems]);

  const toggleCart = useCallback((id) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, inCart: !i.inCart } : i))), [setItems]);

  const updateItem = useCallback((id, patch) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i))), [setItems]);

  const deleteItem = useCallback((id) =>
    setItems((p) => p.filter((i) => i.id !== id)), [setItems]);

  const addItem = useCallback((data) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.name.toLowerCase() === data.name.toLowerCase());
      if (ex) return prev.map((i) => (i.id === ex.id ? { ...i, qty: Math.max(i.qty, 1) } : i));
      return [
        ...prev,
        {
          id: newId(),
          name: data.name,
          qty: data.qty ?? 1,
          unit: data.unit ?? 'und',
          cat: data.cat ?? 'Snacks & Otros',
          store: data.store ?? DEFAULT_STORE,
          note: data.note ?? '',
          inCart: false,
        },
      ];
    });
  }, [setItems]);

  const resetWeek = useCallback(() =>
    setItems((p) => p.map((i) => (i.inCart ? { ...i, qty: 0, inCart: false } : i))), [setItems]);

  const saveWeekToHistory = useCallback(() => {
    const active = items.filter((i) => i.qty > 0);
    if (!active.length) return 'empty';
    const d = new Date();
    const ms = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const label = `Semana del ${d.getDate()} ${ms[d.getMonth()]}`;
    if (history.find((w) => w.label === label)) return 'exists';
    setHistory((p) => [
      {
        id: 'w' + Date.now(),
        label,
        date: d.toISOString(),
        products: active.map((i) => ({ name: i.name, qty: i.qty, unit: i.unit, cat: i.cat, store: i.store, note: i.note, bought: i.inCart })),
      },
      ...p,
    ]);
    return 'ok';
  }, [items, history, setHistory]);

  const restoreWeek = useCallback((weekId) => {
    const week = history.find((w) => w.id === weekId);
    if (!week) return;
    setItems((prev) => {
      const next = [...prev];
      week.products.forEach((p) => {
        const idx = next.findIndex((i) => i.name === p.name);
        if (idx >= 0) next[idx] = { ...next[idx], qty: p.qty, store: p.store, note: p.note, inCart: false };
        else next.push({ id: newId(), name: p.name, qty: p.qty, unit: p.unit, cat: p.cat, store: p.store ?? DEFAULT_STORE, note: p.note, inCart: false });
      });
      return next;
    });
  }, [history, setItems]);

  const deleteWeek = useCallback((weekId) =>
    setHistory((p) => p.filter((w) => w.id !== weekId)), [setHistory]);

  return { items, history, changeQty, toggleCart, updateItem, deleteItem, addItem, resetWeek, saveWeekToHistory, restoreWeek, deleteWeek };
}
