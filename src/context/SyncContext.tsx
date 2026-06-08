/**
 * SyncContext.tsx — Cloud sync provider.
 *
 * Sits between AuthProvider and AppProvider.
 * Responsibilities:
 *  1. On login / session restore: pull Firestore data into localStorage,
 *     then signal that the app is ready to render.
 *  2. On any app-state change: write the current localStorage snapshot
 *     back to Firestore (debounced).
 *  3. Expose syncStatus and lastSyncedAt for the Settings page.
 */

import React, {
  createContext, useContext, useEffect, useRef, useState, useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { loadFromCloud, saveToCloud, clearLocalData } from '../utils/cloudSync';

// ── Types ─────────────────────────────────────────────────────────────────

export type SyncStatus = 'idle' | 'loading' | 'synced' | 'syncing' | 'error';

interface SyncContextValue {
  /** True while the initial cloud load is in progress */
  cloudLoading:  boolean;
  syncStatus:    SyncStatus;
  lastSyncedAt:  Date | null;
  /** Call this whenever important state changes (collection, inventory, etc.) */
  requestSync:   () => void;
  /** Call this on logout — clears local data */
  handleLogout:  () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────

const SyncCtx = createContext<SyncContextValue | null>(null);

// ── Debounce helper ───────────────────────────────────────────────────────

function useDebounced(fn: () => void, ms: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  }, [fn, ms]);
}

// ── Provider ──────────────────────────────────────────────────────────────

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isGuest, logout } = useAuth();

  const [cloudLoading, setCloudLoading] = useState(true);
  const [syncStatus, setSyncStatus]     = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // ── Initial load: pull cloud → localStorage ────────────────────────────

  useEffect(() => {
    if (!user || isGuest) {
      // Guest or not logged in — use existing localStorage data as-is
      setCloudLoading(false);
      setSyncStatus('idle');
      return;
    }

    let cancelled = false;
    setCloudLoading(true);
    setSyncStatus('loading');

    loadFromCloud(user.uid)
      .then(() => {
        if (cancelled) return;
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
      })
      .catch(() => {
        if (cancelled) return;
        // Network error — still show app with local data
        setSyncStatus('error');
      })
      .finally(() => {
        if (!cancelled) setCloudLoading(false);
      });

    return () => { cancelled = true; };
  }, [user?.uid]); // re-run only when the logged-in user changes

  // ── Background sync: localStorage → Firestore ─────────────────────────

  const doSync = useCallback(async () => {
    if (!user || isGuest) return;
    setSyncStatus('syncing');
    try {
      await saveToCloud(user.uid);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch {
      setSyncStatus('error');
    }
  }, [user]);

  const requestSync = useDebounced(doSync, 2000); // debounce 2 s

  // ── Logout ─────────────────────────────────────────────────────────────

  const handleLogout = useCallback(async () => {
    if (user && !isGuest) {
      try { await saveToCloud(user.uid); } catch { /* best-effort */ }
    }
    clearLocalData();
    await logout();
  }, [user, isGuest, logout]);

  return (
    <SyncCtx.Provider value={{ cloudLoading, syncStatus, lastSyncedAt, requestSync, handleLogout }}>
      {children}
    </SyncCtx.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useSyncCtx() {
  const ctx = useContext(SyncCtx);
  if (!ctx) throw new Error('useSyncCtx must be used inside SyncProvider');
  return ctx;
}
