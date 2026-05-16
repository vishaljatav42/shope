import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './admin-components/Sidebar';
import Dashboard from './admin-components/Dashboard';
import ServicesManager from './admin-components/ServicesManager';
import SettingsManager from './admin-components/SettingsManager';
import CustomersManager from './admin-components/CustomersManager';
import Login from './admin-components/Login';
import './admin.css';

function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    
    // Fetch initial theme setting
    fetch('http://localhost:8000/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.darkMode !== 'undefined') {
          setIsDarkMode(data.darkMode);
        }
      })
      .catch(err => console.error('Failed to load theme:', err));
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
    <div className={`admin-wrapper ${!isDarkMode ? 'light-mode' : ''}`}>
      <div className="app-container" style={{ zIndex: 1, position: 'relative' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'bookings' && <Dashboard />}
          {activeTab === 'customers' && <CustomersManager />}
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'settings' && <SettingsManager onThemeChange={setIsDarkMode} />}
          {activeTab !== 'dashboard' && activeTab !== 'bookings' && activeTab !== 'customers' && activeTab !== 'services' && activeTab !== 'settings' && (
            <div className="empty-state animate-fade-in">
              <h2>Module In Development</h2>
              <p>This premium feature is scheduled for Phase 3 of the system upgrade.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminApp;
