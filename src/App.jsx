import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ControlPanel from './pages/ControlPanel';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Demo state
  const [userRole, setUserRole] = useState('Broker'); // 'Main Editor' or 'Broker'
  const [userName, setUserName] = useState('John Broker');
  const [lang, setLang] = useState('en');

  return (
    <Router>
      <div 
        className="app-container" 
        dir={lang === 'ar' ? 'rtl' : 'ltr'} 
        style={{ fontFamily: lang === 'ar' ? '"IBM Plex Sans Arabic", sans-serif' : 'inherit' }}
      >
        <Routes>
          <Route 
            path="/login" 
            element={<LoginPage setAuth={setIsAuthenticated} setRole={setUserRole} setName={setUserName} lang={lang} setLang={setLang} />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard userName={userName} userRole={userRole} lang={lang} setLang={setLang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/panel" 
            element={isAuthenticated && userRole === 'Main Editor' ? <ControlPanel lang={lang} setLang={setLang} /> : <Navigate to="/dashboard" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
