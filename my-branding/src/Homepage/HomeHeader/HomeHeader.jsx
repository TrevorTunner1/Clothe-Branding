import React, { useState } from 'react';
import styles from './HomeHeader.module.css';

const HomeHeader = ({ setActiveTab, cartCount = 0, orderCount = 0 }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Search results with images
  const searchResults = [
    {
      text: 'Oversized Techwear',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=80&h=80&fit=crop'
    },
    {
      text: '450GSM Blueprints',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=80&h=80&fit=crop'
    },
    {
      text: 'Minimalist Streetwear',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80&h=80&fit=crop'
    },
    {
      text: 'Heavyweight Hoodies',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=80&h=80&fit=crop'
    }
  ];

  const trendingTags = ['Streetwear', 'Couture', 'Minimalist', 'Urban'];

  // Cart Icon
  const CartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );

  // Order Icon (Package/Box)
  const OrderIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );

  // Brutige Logo
  const BrutigeLogo = () => (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="50" fill="currentColor"/>
      <path d="M48 25L48 65L25 80L48 25Z" fill="var(--brut-bg)"/>
      <path d="M52 25L52 65L75 80L52 25Z" fill="var(--brut-bg)"/>
    </svg>
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* MOBILE ONLY: Logo + Name (Left Side) */}
        <div className={styles.mobileBrand} onClick={() => setActiveTab('shop')}>
          <BrutigeLogo />
          <span className={styles.brandName}>brutige</span>
        </div>

        {/* LAPTOP ONLY: Expanding Search Bar (Center/Left) */}
        <div className={`${styles.searchContainer} ${searchFocused ? styles.expanded : ''}`}>
          <div className={styles.searchBar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search aesthetics, infrastructure..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
          </div>

          {/* Desktop Search Dropdown with Images */}
          {searchFocused && (
            <div className={styles.searchDropdown}>
              <div className={styles.dropdownSection}>
                <h4>Recent Inquiries</h4>
                <div className={styles.searchResultsList}>
                  {searchResults.map((result, idx) => (
                    <button key={idx} className={styles.searchResultItem}>
                      <span className={styles.resultText}>{result.text}</span>
                      <div className={styles.resultImage}>
                        <img src={result.image} alt={result.text} />
                      </div>
                    </button>
                  ))}
                </div>

                <h4 className={styles.marginTop}>Top Collections</h4>
                <div className={styles.tagCloud}>
                  {trendingTags.map((tag, idx) => (
                    <button key={idx} className={styles.trendTag}>{tag}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UNIVERSAL: Order + Cart Icons (Right Side) */}
        <div className={styles.headerActions}>
          {/* Order Button with Spring Animation */}
          <button 
            className={`${styles.iconBtn} ${styles.orderBtn}`}
            onClick={() => setActiveTab('orders')}
          >
            <OrderIcon />
            {orderCount > 0 && (
              <span className={styles.badge}>{orderCount}</span>
            )}
          </button>

          {/* Cart Button with Spring Animation */}
          <button 
            className={`${styles.iconBtn} ${styles.cartBtn}`}
            onClick={() => setActiveTab('cart')}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className={styles.badge}>{cartCount}</span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

export default HomeHeader;