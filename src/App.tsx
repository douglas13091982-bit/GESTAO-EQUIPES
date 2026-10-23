import React from 'react';
import { AppProvider, useApp } from './context';
import Login from './pages/Login';
import GuardPortal from './pages/GuardPortal';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  return <GuardPortal />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
