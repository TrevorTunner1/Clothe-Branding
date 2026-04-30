import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './LandingPage/LandingPage';
import BrutigePlatform from './Homepage/BrutigePlatform';
import SignInPage from './Form/SignInPage';
import SignUpPage from './Form/SignUpPage';
import MakerSignUp from './Form/MakerSignUp';
import ForgottenPassword from './Form/ForgottenPassword';
import VerifyPassword from './Form/VerifyPassword';
import MakerStudio from './MakerStudio/MakerStudio/MakerStudio';
import { useAuthStore } from './context/AuthContext';

// Global Infrastructure Components
import Preloader from './Homepage/Preloader/Preloader';
import FloatingMessage from './Notification/FloatingMessage';
import { PublicRoutes } from './Routes/PublicRoutes';
import { VerifyRoutes } from './Routes/VerifyRoutes';
import { ProtectedRoutes } from './Routes/ProtectedRoutes';
import OAuthCallback from './Routes/OauthCallBack';

function App() {
  // --- GLOBAL STATE ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('brutige_theme') === 'dark';
  });
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: 'success', visible: false });
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth(); // runs once on load — restores session from cookie
  }, []);
  // --- THEME SYNC ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('brutige_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // --- NOTIFICATION HANDLER ---
  const notify = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    // Auto-hide after 4 seconds
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
  };

  return (
    <Router>
      {/* 1. Global Notification Layer (Floats at bottom) */}
      <FloatingMessage
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
      />

      <Routes>
        {/* 2. Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 3. Auth Flow - Passing 'notify' to every page */}
        <Route path="/login" element={<PublicRoutes><SignInPage notify={notify} /></PublicRoutes>} />
        <Route path="/signup" element={<PublicRoutes><SignUpPage notify={notify} /></PublicRoutes>} />
        <Route path="/maker-signup" element={<PublicRoutes><MakerSignUp notify={notify} /></PublicRoutes>} />
        <Route path="/forgot-password" element={<PublicRoutes><ForgottenPassword notify={notify} /></PublicRoutes>} />
        <Route path="/verify" element={<VerifyRoutes><VerifyPassword notify={notify} /></VerifyRoutes>} />

        {/* Studio */}
        <Route
          path="/studio/*"
          element={
            <ProtectedRoutes>
              {isAppLoading ? (
                <Preloader onComplete={() => setIsAppLoading(false)} />
              ) : (
                <MakerStudio isDarkMode={isDarkMode} toggleTheme={toggleTheme} notify={notify} />
              )}
            </ProtectedRoutes>
          }
        />


        <Route path="/oauth2/callback" element={<OAuthCallback />} />

        {/* Platform */}
        <Route
          path="/platform/*"
          element={
            <ProtectedRoutes>
              {isAppLoading ? (
                <Preloader onComplete={() => setIsAppLoading(false)} />
              ) : (
                <BrutigePlatform isDarkMode={isDarkMode} toggleTheme={toggleTheme} notify={notify} />
              )}
            </ProtectedRoutes>
          }
        />

        {/* 6. Catch-all: Back to Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;