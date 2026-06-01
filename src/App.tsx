import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SyncProvider, useSyncCtx } from './context/SyncContext';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import FloatingPaws from './components/FloatingPaws';
import NotificationContainer from './components/NotificationContainer';
import LoadingScreen from './components/LoadingScreen';
import AuthPage from './pages/AuthPage';
import DiscoveryPage from './pages/DiscoveryPage';
import FavoritesPage from './pages/FavoritesPage';
import CollectionPage from './pages/CollectionPage';
import AnimalQuestPage from './pages/AnimalQuestPage';
import ProgressPage from './pages/ProgressPage';
import InventoryPage from './pages/InventoryPage';
import SettingsPage from './pages/SettingsPage';
import './styles/global.css';

// ── Auth gate: shows AuthPage when not logged in ──────────────────────────

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuth();

  // Firebase is resolving the persisted session — show a minimal spinner
  if (authLoading) {
    return (
      <div className="auth-gate-loading">
        <span className="auth-gate-spinner">🐾</span>
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) return <AuthPage />;
  return <>{children}</>;
}

// ── Cloud loading gate: waits for Firestore data before rendering app ─────

function CloudGate({ children }: { children: React.ReactNode }) {
  const { cloudLoading } = useSyncCtx();

  if (cloudLoading) {
    return (
      <div className="auth-gate-loading">
        <span className="auth-gate-spinner">☁️</span>
        <p>Restoring your progress…</p>
      </div>
    );
  }

  return <>{children}</>;
}

// ── Main app shell ─────────────────────────────────────────────────────────

function AppShell() {
  return (
    <AppProvider>
      <BrowserRouter>
        <LoadingScreen />
        <div className="app-wrapper">
          <FloatingPaws />
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/"            element={<DiscoveryPage />} />
              <Route path="/favorites"   element={<FavoritesPage />} />
              <Route path="/collection"  element={<CollectionPage />} />
              <Route path="/expeditions" element={<AnimalQuestPage />} />
              <Route path="/animal-quest" element={<AnimalQuestPage />} />
              <Route path="/progress"    element={<ProgressPage />} />
              <Route path="/inventory"   element={<InventoryPage />} />
              <Route path="/settings"    element={<SettingsPage />} />
            </Routes>
          </main>
          <NotificationContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <SyncProvider>
          <CloudGate>
            <AppShell />
          </CloudGate>
        </SyncProvider>
      </AuthGate>
    </AuthProvider>
  );
}
