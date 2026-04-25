import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import StudioSideBar from './StudioSideBar/StudioSideBar';
import StudioHeader from './StudioHeader/StudioHeader';
import StudioMobileNav from './StudioMobileNav/StudioMobileNav'; // Ensure path is correct
import AddProduct from './AddProduct/AddProduct';
import Products from './Products/Products';
import OverView from './OverView/OverView';
import Order from './Order/Order';
import Messages from './Messages/Messages';
import Transaction from './Transaction/Transaction';
import StudioSettings from './StudioSettings/StudioSettings';
import ProModal from './ProModal/ProModal';
import useStudioData from '../../hooks/useStudioData';
import styles from './MakerStudio.module.css';

const MakerStudio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });
  
  // STATE FOR PRO MODAL
  const [showProModal, setShowProModal] = useState(false);
  const [isPro, setIsPro] = useState(false);
  
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments[2] || 'overview';

  const studioData = useStudioData();

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleTabChange = (tabId) => {
    const proFeatures = ['transactions', 'analytics'];
    if (proFeatures.includes(tabId) && !isPro) {
      setShowProModal(true); // Open modal if trying to access pro feature
      return;
    }
    navigate(`/studio/${tabId}`);
  };

  const goToPlatform = () => navigate('/platform/shop');

  return (
    <div className={styles.studioWrapper} data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Sidebar */}
      <StudioSideBar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        activeTab={currentTab}
        setActiveTab={handleTabChange}
        goToPlatform={goToPlatform}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isPro={isPro}
        onUpgradeClick={() => setShowProModal(true)}
      />

      {/* Main Content */}
      <main className={`${styles.mainContent} ${isCollapsed ? styles.contentExpanded : styles.contentContracted}`}>
        <StudioHeader 
          activeTab={currentTab}
          goToPlatform={goToPlatform}
          isPro={isPro}
        />
        
        <div className={styles.viewport}>
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverView {...studioData} />} />
            <Route path="add-product" element={<AddProduct {...studioData} />} />
            <Route path="products" element={<Products {...studioData} />} />
            <Route path="orders" element={<Order {...studioData} />} />
            <Route path="messages" element={<Messages {...studioData} />} />
            <Route path="transactions" element={<Transaction {...studioData} />} />
            <Route path="settings" element={<StudioSettings isPro={isPro} onUpgradeClick={() => setShowProModal(true)} />} />
          </Routes>
        </div>
      </main>

      {/* Mobile Navigation - CRITICAL: onUpgradeClick MUST be passed here */}
      <StudioMobileNav 
        activeTab={currentTab} 
        setActiveTab={handleTabChange}
        goToPlatform={goToPlatform}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isPro={isPro}
        onUpgradeClick={() => setShowProModal(true)} 
      />

      {/* Pro Modal - Renders when showProModal is true */}
      {showProModal && (
        <ProModal 
          onClose={() => setShowProModal(false)}
          onUpgrade={(planId) => { 
            console.log(`User upgraded to: ${planId}`); // Optional logging
            setIsPro(true); 
            setShowProModal(false); 
          }}
        />
      )}
    </div>
  );
};

export default MakerStudio;