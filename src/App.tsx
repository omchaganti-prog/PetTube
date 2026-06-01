import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import FloatingPaws from './components/FloatingPaws';
import NotificationContainer from './components/NotificationContainer';
import LoadingScreen from './components/LoadingScreen';
import DiscoveryPage from './pages/DiscoveryPage';
import FavoritesPage from './pages/FavoritesPage';
import CollectionPage from './pages/CollectionPage';
import AnimalQuestPage from './pages/AnimalQuestPage';
import ProgressPage from './pages/ProgressPage';
import InventoryPage from './pages/InventoryPage';
import './styles/global.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <LoadingScreen />
        <div className="app-wrapper">
          <FloatingPaws />
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DiscoveryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/expeditions" element={<AnimalQuestPage />} />
              <Route path="/animal-quest" element={<AnimalQuestPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
            </Routes>
          </main>
          <NotificationContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
