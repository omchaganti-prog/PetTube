/**
 * AuthContext.tsx — Global authentication state.
 *
 * Supports three modes:
 *  1. Signed-in user  — Firebase user, full cloud sync
 *  2. Guest           — No Firebase user, localStorage only
 *  3. Unauthenticated — Show AuthPage
 *
 * Guest progress is kept in localStorage. When a guest creates an account
 * their local data is uploaded to Firestore and a welcome pack is granted.
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
import { grantWelcomePack } from '../utils/cloudSync';

// ── Guest flag ────────────────────────────────────────────────────────────

const GUEST_KEY = 'pettube-guest';

function isGuestSession(): boolean {
  return localStorage.getItem(GUEST_KEY) === 'true';
}

// ── Types ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user:            User | null;
  isGuest:         boolean;
  authLoading:     boolean;
  login:           (email: string, password: string) => Promise<void>;
  register:        (email: string, password: string, displayName: string) => Promise<void>;
  logout:          () => Promise<void>;
  resetPassword:   (email: string) => Promise<void>;
  continueAsGuest: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────

const AuthCtx = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]             = useState<User | null>(null);
  const [isGuest, setIsGuest]       = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Signed-in user supersedes guest mode
        setIsGuest(false);
        localStorage.removeItem(GUEST_KEY);
      } else {
        // Restore guest session if the flag is set
        setIsGuest(isGuestSession());
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const continueAsGuest = useCallback(() => {
    localStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    const wasGuest = isGuestSession();

    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName });
    await sendEmailVerification(newUser);

    // Create Firestore profile document
    await setDoc(doc(db, 'users', newUser.uid), {
      displayName,
      email,
      createdAt: serverTimestamp(),
      lastSyncedAt: serverTimestamp(),
      upgradedFromGuest: wasGuest,
    }, { merge: true });

    // Grant welcome pack — applies directly to localStorage inventory
    // before the first cloud sync so the reward is included in the upload
    if (wasGuest) {
      grantWelcomePack();
      localStorage.removeItem(GUEST_KEY);
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
    await signOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  return (
    <AuthCtx.Provider value={{
      user, isGuest, authLoading,
      login, register, logout, resetPassword, continueAsGuest,
    }}>
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
