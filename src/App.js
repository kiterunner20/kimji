import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ThemeProvider from './context/ThemeProvider';

// Pages
import Home from './pages/Home';
import Progress from './components/Progress';
import Reflection from './pages/Reflection';
import Settings from './pages/Settings';
import PartnerView from './pages/PartnerView';
import ShareSettings from './pages/ShareSettings';
import PrivateRoute from './components/PrivateRoute';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import NotificationsPermission from './components/NotificationsPermission';

import './App.css';

function App() {
  const { darkMode } = useAppContext();

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
          <Header />
          <main className="container">
            <Routes>
              <Route path="/partner/:token" element={<PartnerView />} />
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
              <Route path="/reflection" element={<PrivateRoute><Reflection /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/share" element={<PrivateRoute><ShareSettings /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
          <NotificationsPermission />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
