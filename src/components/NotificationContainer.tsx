import React from 'react';
import { useNotifCtx } from '../context/AppContext';

export default function NotificationContainer() {
  const { notifications, dismiss } = useNotifCtx();
  return (
    <div className="notif-container" aria-live="polite">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`notif-toast ${n.type}`}
          role="status"
          onClick={() => dismiss(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
