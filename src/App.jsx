import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import QuestsListPage from './pages/QuestsListPage';
import QuestEditPage from './pages/QuestEditPage';
import CollectiblesListPage from './pages/CollectiblesListPage';
import CollectibleEditPage from './pages/CollectibleEditPage';
import CollectibleDetailPage from './pages/CollectibleDetailPage';
import MementosListPage from './pages/MementosListPage';
import SubscriptionsListPage from './pages/SubscriptionsListPage';
import PassportsListPage from './pages/PassportsListPage';
import PassportEditPage from './pages/PassportEditPage';
import CollectionsListPage from './pages/CollectionsListPage';
import CollectionEditPage from './pages/CollectionEditPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import { Box, CircularProgress } from '@mui/material';


// Simple protected route component
function ProtectedRoute() {
  const { authToken, isLoading } = useAuth();

  if (isLoading) {
     // Show a loading spinner while checking auth state
     return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
           <CircularProgress />
        </Box>
      );
  }

  return authToken ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/quests" element={<QuestsListPage />} />
        <Route path="/quests/new" element={<QuestEditPage />} />
        <Route path="/quests/:questId/edit" element={<QuestEditPage />} />
        <Route path="/collectibles" element={<CollectiblesListPage />} />
        <Route path="/collectibles/new" element={<CollectibleEditPage />} />
        <Route path="/collectibles/:collectibleId" element={<CollectibleDetailPage />} />
        <Route path="/collectibles/:collectibleId/edit" element={<CollectibleEditPage />} />
        <Route path="/mementos" element={<MementosListPage />} />
        <Route path="/subscriptions" element={<SubscriptionsListPage />} />
        <Route path="/passports" element={<PassportsListPage />} />
        <Route path="/passports/new" element={<PassportEditPage />} />
        <Route path="/passports/:passportId/edit" element={<PassportEditPage />} />
        <Route path="/collections" element={<CollectionsListPage />} />
        <Route path="/collections/new" element={<CollectionEditPage />} />
        <Route path="/collections/:collectionId" element={<CollectionDetailPage />} />
        <Route path="/collections/:collectionId/edit" element={<CollectionEditPage />} />
        {/* Add other protected routes here */}
      </Route>

      {/* Fallback for unmatched routes (optional) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
