import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './admin-components/Sidebar';
import Dashboard from './admin-components/Dashboard';
import ServicesManager from './admin-components/ServicesManager';
import SettingsManager from './admin-components/SettingsManager';
import Login from './admin-components/Login';
import './admin.css';

function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('adminAuth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="admin-wrapper">
      <div className="app-container" style={{ zIndex: 1, position: 'relative' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab !== 'dashboard' && activeTab !== 'services' && activeTab !== 'settings' && (
            <div className="empty-state animate-fade-in">
              <h2>Feature Coming Soon</h2>
              <p>This section is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminApp;
