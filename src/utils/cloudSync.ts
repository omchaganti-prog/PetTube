/**
 * cloudSync.ts — Firestore ↔ localStorage synchronisation.
 *
 * Strategy:
 *  • On login/startup:  loadFromCloud(uid) → writes all Firestore data into
 *    localStorage so existing hooks pick it up immediately.
 *  • On state changes:  saveToCloud(uid, payload) → writes the current app
 *    state to Firestore. Call this whenever collection/inventory/favorites change.
 *
 * This keeps the existing localStorage-based hooks completely unchanged while
 * adding transparent cloud persistence and multi-device sync.
 */

import {
  doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  LS_COLLECTION_KEY, LS_FAVORITES_KEY, LS_MILESTONES_KEY, LS_THEME_KEY,
  LS_PITY_KEY, LS_INVENTORY_KEY,
} from '../constants';

// ── Firestore document shape ──────────────────────────────────────────────

export interface CloudSavePayload {
  collection?:       Record<string, unknown>;
  favorites?:        unknown[];
  inventory?:        Record<string, unknown>;
  milestones?:       number[];
  pity?:             Record<string, unknown>;
  expeditionBoard?:  string[];
  lastSyncedAt?:     unknown; // serverTimestamp()
}

// ── Helpers ───────────────────────────────────────────────────────────────

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage quota – ignore */ }
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Load all saved progress from Firestore and write it into localStorage.
 * Called once after a successful login/session restore.
 * Returns true if cloud data was found, false if this is a new account.
 */
export async function loadFromCloud(uid: string): Promise<boolean> {
  const ref  = doc(db, 'users', uid, 'save', 'data');
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;

  const data = snap.data() as CloudSavePayload;

  if (data.collection)      writeLS(LS_COLLECTION_KEY,       data.collection);
  if (data.favorites)       writeLS(LS_FAVORITES_KEY,        data.favorites);
  if (data.inventory)       writeLS(LS_INVENTORY_KEY,        data.inventory);
  if (data.milestones)      writeLS(LS_MILESTONES_KEY,       data.milestones);
  if (data.pity)            writeLS(LS_PITY_KEY,             data.pity);
  if (data.expeditionBoard) writeLS('pettube-expedition-board', data.expeditionBoard);

  return true;
}

/**
 * Collect the current localStorage state and write it to Firestore.
 * Call this whenever any important state changes.
 */
export async function saveToCloud(uid: string): Promise<void> {
  const payload: CloudSavePayload = {
    collection:      readLS(LS_COLLECTION_KEY,              {}),
    favorites:       readLS(LS_FAVORITES_KEY,               []),
    inventory:       readLS(LS_INVENTORY_KEY,               {}),
    milestones:      readLS(LS_MILESTONES_KEY,              []),
    pity:            readLS(LS_PITY_KEY,                    {}),
    expeditionBoard: readLS('pettube-expedition-board',     []),
    lastSyncedAt:    serverTimestamp(),
  };

  const ref = doc(db, 'users', uid, 'save', 'data');
  await setDoc(ref, payload, { merge: true });
}

/**
 * Wipe all localStorage keys belonging to this app.
 * Called on logout so a new login starts from cloud data.
 */
export function clearLocalData(): void {
  const KEYS = [
    LS_COLLECTION_KEY,
    LS_FAVORITES_KEY,
    LS_INVENTORY_KEY,
    LS_MILESTONES_KEY,
    LS_PITY_KEY,
    LS_THEME_KEY,
    'pettube-expedition-board',
  ];
  for (const k of KEYS) {
    try { localStorage.removeItem(k); } catch { /* ignore */ }
  }
}
