import React, { useState, useRef, useEffect } from 'react';
import styles from './HomeHeader.module.css';

const HomeHeader = ({ setActiveTab, cartCount = 0, orderCount = 0 }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Keyboard Shortcut (⌘ + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const studioUpdates = [
    "Julian V. just started a 50pc production for 'Aura Studio'",
    "New 450GSM Heavyweight Fleece templates added to catalog",
    "Infrastructure update: Global shipping now active for 52 countries"
  ];

  const ateliers = [
    { id: 1, name: "Admin", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
    { id: 2, name: "Julian", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
    { id: 3, name: "Elena", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" }
  ];

  const searchResults = [
    { text: 'Oversized Techwear', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=80' },
    { text: '450GSM Blueprints', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=80' }
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const BrutigeLogo = () => (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="50" fill="var(--brut-text)"/>
      <path d="M48 25L48 65L25 80L48 25Z" fill="var(--brut-bg)"/>
      <path d="M52 25L52 65L75 80L52 25Z" fill="var(--brut-bg)"/>
    </svg>
  );

  return (
    <div className={styles.headerWrapper}>
      {/* 1. STUDIO TICKER */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {studioUpdates.concat(studioUpdates).map((update, i) => (
            <span key={i} className={styles.tickerItem}>
              <span className={styles.tickerDot}>•</span> {update}
            </span>
          ))}
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.container}>
          
          {/* MOBILE ONLY: BRANDING */}
          <div className={styles.mobileBrand} onClick={() => setActiveTab('shop')}>
            <BrutigeLogo />
            <span className={styles.brandName}>brutige</span>
          </div>

          {/* LAPTOP ONLY: SEARCH */}
          <div className={`${styles.searchContainer} ${searchFocused ? styles.expanded : ''}`}>
            <div className={styles.searchBar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search aesthetics, infrastructure..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              />
              {!searchFocused && (
                <div className={styles.kbdShortcut}>
                  <kbd>⌘</kbd><kbd>K</kbd>
                </div>
              )}
            </div>

            {searchFocused && (
              <div className={styles.searchDropdown}>
                <div className={styles.dropdownSection}>
                  <div className={styles.searchMeta}>124 results found in 0.04s</div>
                  
                  <h4>Atelier Profiles</h4>
                  <div className={styles.atelierRow}>
                    {ateliers.map(a => (
                      <div key={a.id} className={styles.atelierStory}>
                        <div className={styles.ring}><img src={a.img} alt="" /></div>
                        <span>{a.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className={styles.marginTop}>Recent Inquiries</h4>
                  <div className={styles.searchResultsList}>
                    {searchResults.map((result, idx) => (
                      <button key={idx} className={styles.searchResultItem}>
                        <span className={styles.resultText}>{result.text}</span>
                        <div className={styles.resultImage}><img src={result.image} alt="" /></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className={styles.headerActions}>
            <input type="file" ref={fileInputRef} hidden onChange={handleLogoUpload} accept="image/*" />
            <button 
              className={`${styles.iconBtn} ${logoPreview ? styles.logoLive : ''}`} 
              onClick={() => fileInputRef.current.click()}
            >
              {logoPreview ? <img src={logoPreview} className={styles.thumb} alt="" /> : 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              }
            </button>

            <button className={styles.iconBtn} onClick={() => setActiveTab('orders')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              {orderCount > 0 && <span className={styles.badge}>{orderCount}</span>}
            </button>

            <button className={styles.iconBtn} onClick={() => setActiveTab('cart')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </button>
          </div>

        </div>
      </header>
    </div>
  );
};

export default HomeHeader;