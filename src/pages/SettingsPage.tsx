import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSyncCtx } from '../context/SyncContext';

function syncIcon(status: string) {
  if (status === 'syncing' || status === 'loading') return '🔄';
  if (status === 'error')  return '⚠️';
  if (status === 'synced') return '☁️';
  return '☁️';
}

function syncLabel(status: string) {
  if (status === 'syncing') return 'Syncing…';
  if (status === 'loading') return 'Loading cloud data…';
  if (status === 'error')   return 'Sync error — will retry';
  if (status === 'synced')  return 'Synced';
  return 'Saved locally';
}

export default function SettingsPage() {
  const { user, isGuest }                          = useAuth();
  const { syncStatus, lastSyncedAt, handleLogout } = useSyncCtx();
  const navigate = useNavigate();

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
      </div>

      {/* ── Guest upgrade card ── */}
      {isGuest && (
        <section className="settings-guest-card">
          <div className="settings-guest-icon">🐾</div>
          <div className="settings-guest-body">
            <h2>👤 Guest Explorer</h2>
            <p>Your progress is saved on this device only. Create a free account to protect it and play on any device.</p>
            <ul className="settings-guest-benefits">
              <li>☁️ Cloud saves — never lose progress</li>
              <li>📱 Multi-device sync</li>
              <li>🔒 Secure backup</li>
              <li>🎁 Welcome Pack (Rare Ticket + Boost)</li>
            </ul>
            <button className="settings-upgrade-btn" onClick={() => navigate('/upgrade')}>
              ☁️ Create Free Account — Keep All Progress
            </button>
          </div>
        </section>
      )}

      {/* ── Signed-in account section ── */}
      {!isGuest && user && (
        <section className="settings-section">
          <h2 className="settings-section-title">Account</h2>

          <div className="settings-row">
            <span className="settings-row-label">👤 Signed in as</span>
            <span className="settings-row-value">{user.displayName || user.email}</span>
          </div>

          <div className="settings-row">
            <span className="settings-row-label">📧 Email</span>
            <span className="settings-row-value">{user.email}</span>
          </div>

          <div className="settings-row">
            <span className="settings-row-label">✅ Verified</span>
            <span className="settings-row-value">
              {user.emailVerified ? 'Yes' : 'No — check your inbox'}
            </span>
          </div>
        </section>
      )}

      {/* ── Cloud sync section ── */}
      <section className="settings-section">
        <h2 className="settings-section-title">Cloud Sync</h2>

        <div className="settings-row">
          <span className="settings-row-label">
            {syncIcon(syncStatus)} Status
          </span>
          <span
            className="settings-row-value"
            style={{
              color: syncStatus === 'error' ? '#f87171'
                   : syncStatus === 'synced' ? '#4ade80'
                   : 'var(--text)',
            }}
          >
            {syncLabel(syncStatus)}
          </span>
        </div>

        {lastSyncedAt && (
          <div className="settings-row">
            <span className="settings-row-label">🕐 Last synced</span>
            <span className="settings-row-value">{lastSyncedAt.toLocaleTimeString()}</span>
          </div>
        )}

        <p className="settings-sync-note">
          {isGuest
            ? 'Guest progress is saved in your browser. Create an account to enable cloud sync.'
            : 'Your collection, inventory, favorites, and expedition progress sync automatically.'}
        </p>
      </section>

      {/* ── Logout / leave guest ── */}
      <section className="settings-section">
        <h2 className="settings-section-title">Session</h2>
        <button className="settings-logout-btn" onClick={handleLogout}>
          🚪 {isGuest ? 'Leave Guest Mode' : 'Log Out'}
        </button>
        <p className="settings-logout-note">
          {isGuest
            ? 'Leaving guest mode will clear your local progress. Create an account first to keep it!'
            : 'Your progress is saved to the cloud. You can sign back in anytime.'}
        </p>
      </section>
    </div>
  );
}

