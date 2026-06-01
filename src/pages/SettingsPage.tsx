import React from 'react';
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
  return 'Not synced';
}

export default function SettingsPage() {
  const { user }                      = useAuth();
  const { syncStatus, lastSyncedAt, handleLogout } = useSyncCtx();

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
      </div>

      {/* Account section */}
      <section className="settings-section">
        <h2 className="settings-section-title">Account</h2>

        <div className="settings-row">
          <span className="settings-row-label">👤 Signed in as</span>
          <span className="settings-row-value">{user?.displayName || user?.email}</span>
        </div>

        <div className="settings-row">
          <span className="settings-row-label">📧 Email</span>
          <span className="settings-row-value">{user?.email}</span>
        </div>

        <div className="settings-row">
          <span className="settings-row-label">✅ Verified</span>
          <span className="settings-row-value">
            {user?.emailVerified ? 'Yes' : 'No — check your inbox'}
          </span>
        </div>
      </section>

      {/* Sync section */}
      <section className="settings-section">
        <h2 className="settings-section-title">Cloud Sync</h2>

        <div className="settings-row">
          <span className="settings-row-label">
            {syncIcon(syncStatus)} Status
          </span>
          <span
            className="settings-row-value"
            style={{ color: syncStatus === 'error' ? '#f87171' : syncStatus === 'synced' ? '#4ade80' : 'var(--text)' }}
          >
            {syncLabel(syncStatus)}
          </span>
        </div>

        {lastSyncedAt && (
          <div className="settings-row">
            <span className="settings-row-label">🕐 Last synced</span>
            <span className="settings-row-value">
              {lastSyncedAt.toLocaleTimeString()}
            </span>
          </div>
        )}

        <p className="settings-sync-note">
          Your collection, inventory, favorites, and expedition progress sync automatically to your account and are available on any device.
        </p>
      </section>

      {/* Logout */}
      <section className="settings-section">
        <h2 className="settings-section-title">Session</h2>
        <button className="settings-logout-btn" onClick={handleLogout}>
          🚪 Log Out
        </button>
        <p className="settings-logout-note">
          Your progress is saved to the cloud. You can sign back in anytime.
        </p>
      </section>
    </div>
  );
}
