/**
 * AuthContext.tsx — Global authentication state.
 *
 * Wraps the app with Firebase auth state. Provides:
 *  - Current user (or null if logged out)
 *  - Auth loading flag (true while Firebase resolves the initial session)
 *  - login / register / logout / resetPassword helpers
 *
 * Session persistence is handled by Firebase itself (browserLocalPersistence),
 * so the user stays logged in across page refreshes and app restarts.
 */

import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// ── Types ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user:           User | null;
  authLoading:    boolean;
  login:          (email: string, password: string) => Promise<void>;
  register:       (email: string, password: string, displayName: string) => Promise<void>;
  logout:         () => Promise<void>;
  resetPassword:  (email: string) => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────

const AuthCtx = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for auth state changes (fires on startup to restore persisted session)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name
    await updateProfile(newUser, { displayName });

    // Send email verification
    await sendEmailVerification(newUser);

    // Create Firestore profile document
    await setDoc(doc(db, 'users', newUser.uid), {
      displayName,
      email,
      createdAt: serverTimestamp(),
      lastSyncedAt: serverTimestamp(),
    }, { merge: true });
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, authLoading, login, register, logout, resetPassword }}>
      {children}
    </AuthCtx.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
