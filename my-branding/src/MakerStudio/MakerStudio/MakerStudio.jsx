import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import StudioSideBar from './StudioSideBar/StudioSideBar';
import StudioHeader from './StudioHeader/StudioHeader';
import StudioMobileNav from './StudioMobileNav/StudioMobileNav';
import AddProduct from './AddProduct/AddProduct';
import Products from './Products/Products';
import OverView from './OverView/OverView';
import Order from './Order/Order';
import Messages from './Messages/Messages';
import Transaction from './Transaction/Transaction';
import StudioSettings from './StudioSettings/StudioSettings';
import styles from './MakerStudio.module.css';

const MakerStudio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Get current tab from URL
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments[2] || 'add-product';

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleTabChange = (tabId) => {
    navigate(`/studio/${tabId}`);
  };

  // Go back to platform
  const goToPlatform = () => {
    navigate('/platform/shop');
  };

  return (
    <div className={styles.studioWrapper} data-theme={isDarkMode ? 'dark' : 'light'}>
      <StudioSideBar 
        activeTab={currentTab}
        setActiveTab={handleTabChange}
        goToPlatform={goToPlatform}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <main className={styles.mainContent}>
        <StudioHeader 
          activeTab={currentTab}
          goToPlatform={goToPlatform}
        />
        
        <div className={styles.viewport}>
          <Routes>
            <Route path="/" element={<Navigate to="add-product" replace />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<Products />} />
            <Route path="overview" element={<OverView />} />
            <Route path="orders" element={<Order />} />
            <Route path="messages" element={<Messages />} />
            <Route path="transactions" element={<Transaction />} />
            <Route path="settings" element={<StudioSettings />} />
          </Routes>
        </div>
      </main>

      <StudioMobileNav 
        activeTab={currentTab}
        setActiveTab={handleTabChange}
        goToPlatform={goToPlatform}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};

export default MakerStudio;