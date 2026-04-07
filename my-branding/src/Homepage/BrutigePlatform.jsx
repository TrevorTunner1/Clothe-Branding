import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './DesktopSidebar/Sidebar';
import MobileNav from './MobileNav/MobileNav';
import HomeHeader from './HomeHeader/HomeHeader';
import MasonryFeed from './HomeFeed/MasonryFeed';
import ProductDetail from './ProductDetail/ProductDetail';
import MakerStudio from './MakerStudio/MakerStudio';
import ChatRoom from './ChatRoom/ChatRoom';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import CartView from './CartView/CartView';
import OrdersView from './OrdersView/OrdersView';
import SavedView from './SavedView/SavedView';
import styles from './BrutigePlatform.module.css';

const BrutigePlatform = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // High-end route detection
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments[2] || 'shop';

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  // Navigation logic with auto-reset for product detail
  const handleTabChange = (tabId) => {
    setSelectedProduct(null);
    navigate(`/platform/${tabId}`);
  };

  // State Persistance
  useEffect(() => {
    const saved = localStorage.getItem('brut_saved');
    if (saved) setSavedItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('brut_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  const addToCart = (product, quantity = 1, size = 'M') => {
    setCartItems(prev => [...prev, { ...product, quantity, size }]);
  };

  const toggleSaved = (product) => {
    setSavedItems(prev => {
      const isSaved = prev.some(item => item.id === product.id);
      return isSaved ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  };

  return (
    <div className={styles.platformWrapper}>
      <Sidebar 
        activeTab={currentTab} 
        setActiveTab={handleTabChange} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
      />

      <main className={styles.mainContent}>
        {!selectedProduct && (
          <HomeHeader 
            activeTab={currentTab} 
            setActiveTab={handleTabChange} 
            cartCount={cartItems.length} 
          />
        )}
        
        <div className={styles.viewport}>
          <Routes>
            <Route path="/" element={<Navigate to="shop" replace />} />
            
            <Route path="shop" element={
               selectedProduct ? (
                 <ProductDetail 
                    product={selectedProduct} onBack={() => setSelectedProduct(null)} 
                    addToCart={addToCart} isSaved={savedItems.some(i => i.id === selectedProduct.id)} toggleSaved={() => toggleSaved(selectedProduct)}
                 />
               ) : (
                 <MasonryFeed onSelect={setSelectedProduct} savedItems={savedItems} toggleSaved={toggleSaved} addToCart={addToCart} />
               )
            } />
            
            <Route path="chat" element={<ChatRoom />} />
            
            {/* NESTED MAKER ROUTES: studio/* enables /platform/studio/queue */}
            <Route path="studio/*" element={<MakerStudio />} />
            
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="cart" element={<CartView cartItems={cartItems} />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="saved" element={<SavedView savedItems={savedItems} onSelect={setSelectedProduct} toggleSaved={toggleSaved} />} />
          </Routes>
        </div>
      </main>

      <MobileNav 
        activeTab={currentTab} 
        setActiveTab={handleTabChange} 
        cartCount={cartItems.length} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};

export default BrutigePlatform;