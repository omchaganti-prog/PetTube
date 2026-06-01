import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register' | 'reset';

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':              return 'Please enter a valid email address.';
    case 'auth/user-not-found':             return 'No account found with that email.';
    case 'auth/wrong-password':             return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':       return 'An account with this email already exists.';
    case 'auth/weak-password':              return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':          return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':     return 'Network error. Check your connection and try again.';
    case 'auth/invalid-credential':        return 'Invalid email or password.';
    default:                               return 'Something went wrong. Please try again.';
  }
}

export default function AuthPage() {
  const { login, register, resetPassword } = useAuth();

  const [mode, setMode]               = useState<Mode>('login');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError]             = useState('');
  const [info, setInfo]               = useState('');
  const [loading, setLoading]         = useState(false);

  const clearMessages = () => { setError(''); setInfo(''); };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else if (mode === 'register') {
        if (!displayName.trim()) { setError('Please enter your name.'); setLoading(false); return; }
        await register(email.trim(), password, displayName.trim());
        setInfo('Account created! Check your email to verify your address.');
      } else {
        await resetPassword(email.trim());
        setInfo('Password reset email sent! Check your inbox.');
        setMode('login');
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(getFirebaseErrorMessage(code));
    } finally {
      setLoading(false);
    }
  }, [mode, email, password, displayName, login, register, resetPassword]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-logo">🐾</span>
          <h1 className="auth-title">PetTube</h1>
          <p className="auth-subtitle">Discover the animal kingdom</p>
        </div>

        {/* Mode tabs */}
        {mode !== 'reset' && (
          <div className="auth-tabs">
            <button
              className={`auth-tab${mode === 'login' ? ' active' : ''}`}
              onClick={() => { setMode('login'); clearMessages(); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab${mode === 'register' ? ' active' : ''}`}
              onClick={() => { setMode('register'); clearMessages(); }}
            >
              Create Account
            </button>
          </div>
        )}

        {mode === 'reset' && (
          <div className="auth-reset-header">
            <h2>Reset Password</h2>
            <p>Enter your email and we'll send a reset link.</p>
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Your Name</label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                placeholder="Explorer name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'reset' && (
            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}
          {info  && <p className="auth-info"  role="status">{info}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? '...'
              : mode === 'login'    ? 'Sign In'
              : mode === 'register' ? 'Create Account'
              : 'Send Reset Link'}
          </button>
        </form>

        {/* Footer links */}
        <div className="auth-footer">
          {mode === 'login' && (
            <button className="auth-link" onClick={() => { setMode('reset'); clearMessages(); }}>
              Forgot your password?
            </button>
          )}
          {mode === 'reset' && (
            <button className="auth-link" onClick={() => { setMode('login'); clearMessages(); }}>
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
