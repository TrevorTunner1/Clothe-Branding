import React, { useState } from 'react';
import styles from './SavedView.module.css';

const SavedView = ({ savedItems, onSelect, toggleSaved, addToCart }) => {
  const [activeCollection, setActiveCollection] = useState('All');
  const collections = ['All', 'Streetwear', 'Minimalist', 'Summer Drop', 'Blueprints'];

  // --- NEW: Helper for Share functionality ---
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Wishlist link copied to infrastructure clipboard.");
  };

  // --- NEW: Move all items to cart logic ---
  const moveAllToCart = () => {
    savedItems.forEach(item => addToCart(item, 1, 'M'));
    alert("All saved items moved to branding loop.");
  };

  if (savedItems.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.illustrationWrapper}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            <path d="M12 7v6M9 10h6" opacity="0.3"/>
          </svg>
        </div>
        <h2>Your Archive is Empty</h2>
        <p>Start saving premium templates to build your personal brand collection.</p>
        <button className={styles.browseBtn} onClick={() => window.location.href='/platform/shop'}>
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 1. ARCHIVE HEADER WITH ACTIONS */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Saved Infrastructure</h1>
          <span className={styles.count}>{savedItems.length} templates archived</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn} onClick={handleShare} title="Share Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
            </svg>
            Share
          </button>
          <button className={styles.btnPrimary} onClick={moveAllToCart}>
            Move All to Cart
          </button>
        </div>
      </div>

      {/* 2. COLLECTIONS / FOLDERS PILLS */}
      <div className={styles.collectionsBar}>
        {collections.map(col => (
          <button 
            key={col} 
            className={`${styles.colPill} ${activeCollection === col ? styles.activeCol : ''}`}
            onClick={() => setActiveCollection(col)}
          >
            {col}
          </button>
        ))}
        <button className={styles.addColBtn}>+ New Collection</button>
      </div>

      {/* 3. SAVED ITEMS GRID */}
      <div className={styles.grid}>
        {savedItems.map(item => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <div className={styles.clickableImg} onClick={() => onSelect(item)}>
                <img src={item.img} alt={item.title} />
              </div>

              {/* NEW: DYNAMIC ALERTS (Mock Logic) */}
              <div className={styles.badges}>
                {item.id % 2 === 0 && <span className={styles.stockAlert}>Only 2 Left</span>}
                {item.id % 3 === 0 && <span className={styles.priceDrop}>Price Dropped</span>}
              </div>

              {/* UNSAVE ACTION */}
              <button 
                className={styles.unsaveBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaved(item);
                }}
                aria-label="Remove from saved"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>

              {/* QUICK MOVE TO CART */}
              <button 
                className={styles.quickCartBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item, 1, 'M');
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>

            <div className={styles.cardInfo}>
              <div className={styles.itemMain}>
                <h3>{item.title}</h3>
                <p className={styles.price}>{item.price}</p>
              </div>
              
              {/* NEW: METADATA & TIMESTAMP */}
              <div className={styles.metaRow}>
                <span className={styles.timestamp}>Added 2 days ago</span>
                <span className={styles.dot}>•</span>
                <span className={styles.category}>{item.category || 'Streetwear'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedView;