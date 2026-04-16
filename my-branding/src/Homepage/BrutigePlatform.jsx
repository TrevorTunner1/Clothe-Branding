import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './DesktopSidebar/Sidebar';
import MobileNav from './MobileNav/MobileNav';
import HomeHeader from './HomeHeader/HomeHeader';
import MasonryFeed from './HomeFeed/MasonryFeed';
import ProductDetail from './ProductDetail/ProductDetail';
import ChatRoom from './ChatRoom/ChatRoom';
import ProfileView from './ProfileView/ProfileView';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import CartView from './CartView/CartView';
import OrdersView from './OrdersView/OrdersView';
import SavedView from './SavedView/SavedView';
import SearchView from './SearchView/SearchView';
import styles from './BrutigePlatform.module.css';

const BrutigePlatform = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments[2] || 'shop';

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [userAvatar, setUserAvatar] = useState(null);

  // Load avatar from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('brut_avatar');
    if (savedAvatar) setUserAvatar(savedAvatar);
  }, []);

  // Save avatar to localStorage when it changes
  useEffect(() => {
    if (userAvatar) localStorage.setItem('brut_avatar', userAvatar);
  }, [userAvatar]);

  const handleTabChange = (tabId) => {
    setSelectedProduct(null);
    navigate(`/platform/${tabId}`);
  };

  // Navigate to Studio (now a separate page)
  const goToStudio = () => {
    navigate('/studio');  // Changed from /platform/studio to /studio
  };

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
        goToStudio={goToStudio}  // Pass studio navigation handler
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
      />

      <main className={styles.mainContent}>
        {!selectedProduct && currentTab !== 'search' && (
          <HomeHeader 
            activeTab={currentTab} 
            setActiveTab={handleTabChange} 
            cartCount={cartItems.length}
            userAvatar={userAvatar}
          />
        )}
        
        <div className={styles.viewport}>
          <Routes>
            <Route path="/" element={<Navigate to="shop" replace />} />
            
            <Route path="shop" element={
               selectedProduct ? (
                 <ProductDetail 
                    product={selectedProduct} 
                    onBack={() => setSelectedProduct(null)} 
                    addToCart={addToCart} 
                    isSaved={savedItems.some(i => i.id === selectedProduct.id)} 
                    toggleSaved={() => toggleSaved(selectedProduct)}
                 />
               ) : (
                 <MasonryFeed 
                   onSelect={setSelectedProduct} 
                   savedItems={savedItems} 
                   toggleSaved={toggleSaved} 
                   addToCart={addToCart} 
                 />
               )
            } />
            
            <Route path="search" element={<SearchView onSelect={setSelectedProduct} />} />
            <Route path="chat" element={<ChatRoom />} />
            {/* REMOVED: studio route is now at top level in App.js */}
            
            {/* Profile - Public view with products grid */}
            <Route 
              path="profile" 
              element={
                <ProfileView 
                  setActiveTab={handleTabChange} 
                  userAvatar={userAvatar}
                  setUserAvatar={setUserAvatar}
                />
              } 
            />
            
            {/* Settings - Private configuration */}
            <Route 
              path="settings" 
              element={
                <ProfileSettings 
                  userAvatar={userAvatar}
                  setUserAvatar={setUserAvatar}
                />
              } 
            />
            
            <Route path="cart" element={<CartView cartItems={cartItems} />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="saved" element={
              <SavedView 
                savedItems={savedItems} 
                onSelect={setSelectedProduct} 
                toggleSaved={toggleSaved} 
              />
            } />
          </Routes>
        </div>
      </main>

      <MobileNav 
        activeTab={currentTab} 
        setActiveTab={handleTabChange}
        goToStudio={goToStudio}  // Pass studio navigation handler
        cartCount={cartItems.length} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};

export default BrutigePlatform;