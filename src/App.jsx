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
        <Route path="/collectibles/:collectibleId/edit" element={<CollectibleEditPage />} />
        {/* Add other protected routes here */}
      </Route>

      {/* Fallback for unmatched routes (optional) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
