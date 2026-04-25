import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
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

// Wrapper component to handle URL params for Profile
const ProfileWrapper = ({ userAvatar, setUserAvatar, setActiveTab }) => {
  const { makerId } = useParams();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    // Navigate to product detail within the shop flow
    // We need to trigger the parent's setSelectedProduct logic ideally, 
    // but for now we navigate to the shop route with state or just console log
    console.log("Product clicked from Profile:", product);
    // Simple way: navigate back to shop and select (requires context lifting, keeping it simple for now)
    // For this demo, we assume ProductDetail handles its own internal state if passed via link
    // But to work with current architecture, we navigate to shop and hope user clicks again 
    // OR we pass a function down. Let's pass a navigate function.
    navigate(`/platform/shop`, { state: { selectedProduct: product } });
  };

  const handleMessageMaker = () => {
    navigate('/platform/chat');
  };

  return (
    <ProfileView 
      makerId={makerId}
      userAvatar={userAvatar}
      setUserAvatar={setUserAvatar}
      onProductClick={handleProductClick}
      onMessageMaker={handleMessageMaker}
    />
  );
};

const BrutigePlatform = ({ isDarkMode, toggleTheme, notify }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments[2] || 'shop';

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [userAvatar, setUserAvatar] = useState(null);

  // Check for product in navigation state (from ProfileView click)
  useEffect(() => {
    if (location.state?.selectedProduct) {
      setSelectedProduct(location.state.selectedProduct);
      // Clear state so it doesn't persist on back navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('brut_avatar');
    if (savedAvatar) setUserAvatar(savedAvatar);
  }, []);

  useEffect(() => {
    if (userAvatar) localStorage.setItem('brut_avatar', userAvatar);
  }, [userAvatar]);

  const handleTabChange = (tabId) => {
    setSelectedProduct(null);
    navigate(`/platform/${tabId}`);
  };

  const goToStudio = () => {
    navigate('/studio');
  };

  const addToCart = (product, quantity = 1, size = 'M', color = 'Default') => {
    setCartItems(prev => [...prev, { ...product, quantity, size, color }]);
    if (notify) notify('Added to Loop', 'success');
  };

  const toggleSaved = (product) => {
    setSavedItems(prev => {
      const isSaved = prev.some(item => item.id === product.id);
      if (!isSaved && notify) notify('Saved to Archive', 'success');
      return isSaved ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  };

  // Determine if we should show header
  const showHeader = !selectedProduct && 
                     currentTab !== 'search' && 
                     !location.pathname.includes('/profile') &&
                     !location.pathname.includes('/settings');

  return (
    <div className={styles.platformWrapper}>
      <Sidebar 
        activeTab={currentTab} 
        setActiveTab={handleTabChange}
        goToStudio={goToStudio}
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
      />

      <main className={styles.mainContent}>
        {showHeader && (
          <HomeHeader 
            activeTab={currentTab} 
            setActiveTab={handleTabChange} 
            cartCount={cartItems.length}
            userAvatar={userAvatar}
            userName="User"
          />
        )}
        
        <div className={styles.viewport}>
          <Routes location={location}>
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
            
            {/* Dynamic Profile Route: /platform/profile/:makerId */}
            <Route 
              path="profile/:makerId" 
              element={
                <ProfileWrapper 
                  userAvatar={userAvatar}
                  setUserAvatar={setUserAvatar}
                  setActiveTab={handleTabChange}
                />
              } 
            />
            
            {/* Fallback Profile Route: /platform/profile (Current User) */}
            <Route 
              path="profile" 
              element={
                <ProfileView 
                  makerId="me" 
                  userAvatar={userAvatar}
                  setUserAvatar={setUserAvatar}
                  onProductClick={(p) => console.log(p)}
                  onMessageMaker={() => navigate('/platform/chat')}
                />
              } 
            />
            
            <Route 
              path="settings" 
              element={
                <ProfileSettings 
                  userProfile={{ avatar: userAvatar }}
                  setUserProfile={(data) => setUserAvatar(data.avatar)}
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
                addToCart={addToCart}
              />
            } />
          </Routes>
        </div>
      </main>

      <MobileNav 
        activeTab={currentTab} 
        setActiveTab={handleTabChange}
        goToStudio={goToStudio}
        cartCount={cartItems.length} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};

export default BrutigePlatform;