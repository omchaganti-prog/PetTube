import React, { createContext, useContext } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';
import { useNotification } from '../hooks/useNotification';
import { useCollection } from '../hooks/useCollection';
import { useInventory } from '../hooks/useInventory';

type FavoritesCtx = ReturnType<typeof useFavorites>;
type ThemeCtx = ReturnType<typeof useTheme>;
type NotifCtx = ReturnType<typeof useNotification>;
type CollectionCtxType = ReturnType<typeof useCollection>;
type InventoryCtxType = ReturnType<typeof useInventory>;

const FavCtx        = createContext<FavoritesCtx | null>(null);
const ThemeCtx      = createContext<ThemeCtx | null>(null);
const NotifCtx      = createContext<NotifCtx | null>(null);
const CollectionCtx = createContext<CollectionCtxType | null>(null);
const InventoryCtx  = createContext<InventoryCtxType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const favorites  = useFavorites();
  const theme      = useTheme();
  const notif      = useNotification();
  const collection = useCollection();
  const inventory  = useInventory();
  return (
    <ThemeCtx.Provider value={theme}>
      <FavCtx.Provider value={favorites}>
        <NotifCtx.Provider value={notif}>
          <CollectionCtx.Provider value={collection}>
            <InventoryCtx.Provider value={inventory}>
              {children}
            </InventoryCtx.Provider>
          </CollectionCtx.Provider>
        </NotifCtx.Provider>
      </FavCtx.Provider>
    </ThemeCtx.Provider>
  );
}

export function useFavCtx() {
  const ctx = useContext(FavCtx);
  if (!ctx) throw new Error('useFavCtx must be used inside AppProvider');
  return ctx;
}

export function useThemeCtx() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useThemeCtx must be used inside AppProvider');
  return ctx;
}

export function useNotifCtx() {
  const ctx = useContext(NotifCtx);
  if (!ctx) throw new Error('useNotifCtx must be used inside AppProvider');
  return ctx;
}

export function useCollectionCtx() {
  const ctx = useContext(CollectionCtx);
  if (!ctx) throw new Error('useCollectionCtx must be used inside AppProvider');
  return ctx;
}

export function useInventoryCtx() {
  const ctx = useContext(InventoryCtx);
  if (!ctx) throw new Error('useInventoryCtx must be used inside AppProvider');
  return ctx;
}
