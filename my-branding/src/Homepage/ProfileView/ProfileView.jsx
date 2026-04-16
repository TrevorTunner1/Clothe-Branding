import React, { useState, useRef } from 'react';
import styles from './ProfileView.module.css';

const ProfileView = ({ setActiveTab, userAvatar, setUserAvatar }) => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTabLocal] = useState('products'); // products, media
  
  // Mock user data
  const user = {
    name: "Julian V.",
    handle: "@julianv_studio",
    bio: "Creative director specializing in heavyweight blanks & techwear aesthetics. Based in Berlin.",
    location: "Berlin, DE",
    joinDate: "March 2024",
    products: 12,
    sales: 48
  };

  // Mock products
  const products = [
    {
      id: 1,
      title: "450GSM Heavyweight Tee",
      price: "$89",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      status: "active"
    },
    {
      id: 2,
      title: "Techwear Cargo Pants V2",
      price: "$145",
      image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400",
      status: "active"
    },
    {
      id: 3,
      title: "Oversized Hoodie - Black",
      price: "$120",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      status: "draft"
    },
    {
      id: 4,
      title: "Structured Cap",
      price: "$45",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
      status: "active"
    }
  ];

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result); // Updates header immediately
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        hidden 
        accept="image/*" 
        onChange={handleFileChange}
      />

      <div className={styles.container}>
        {/* Profile Header - Clean, no cover image */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div 
              className={styles.avatarWrapper} 
              onClick={handleAvatarClick}
              title="Click to change photo"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
              <div className={styles.editOverlay}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
            
            <div className={styles.userActions}>
              <button 
                className={styles.settingsBtn}
                onClick={() => setActiveTab('settings')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Settings
              </button>
            </div>
          </div>

          <div className={styles.userInfo}>
            <h1 className={styles.name}>{user.name}</h1>
            <span className={styles.handle}>{user.handle}</span>
            <p className={styles.bio}>{user.bio}</p>
            
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {user.location}
              </span>
              <span className={styles.metaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Joined {user.joinDate}
              </span>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <strong>{user.products}</strong>
                <span>Products</span>
              </div>
              <div className={styles.stat}>
                <strong>{user.sales}</strong>
                <span>Sales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            <h2>My Catalog</h2>
            <button 
              className={styles.addBtn}
              onClick={() => setActiveTab('studio')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Product
            </button>
          </div>

          <div className={styles.productsGrid}>
            {products.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.title} />
                  {product.status === 'draft' && (
                    <span className={styles.statusBadge}>Draft</span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.title}</h3>
                  <div className={styles.productFooter}>
                    <span className={styles.price}>{product.price}</span>
                    <button className={styles.editBtn}>Edit</button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Placeholder */}
            <button className={styles.addCard} onClick={() => setActiveTab('studio')}>
              <div className={styles.addIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;