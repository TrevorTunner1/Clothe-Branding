import React, { useState, useRef } from 'react';
import styles from './StudioSettings.module.css';
import TwoFactorAuth from '../TwoFactorAuth/TwoFactorAuth';

const StudioSettings = ({ isPro, onUpgradeClick }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const fileInputRef = useRef(null);

  // Mock Profile Image State
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200');

  const [settings, setSettings] = useState({
    // Profile
    businessName: 'Aura Studio',
    handle: '@aurastudio',
    contactEmail: 'hello@aurastudio.com',
    bio: 'Premium heavyweight streetwear manufactured with precision.',
    
    // General
    currency: 'USD',
    timezone: 'America/New_York',
    
    // Products
    lowStockThreshold: '5',
    defaultStatus: 'draft',
    
    // Payments
    notifications: true,
    autoFulfill: false,
    taxRate: '8.5',
    
    // Shipping
    shippingOrigin: 'New York, USA',
    freeShippingThreshold: '150',
    flatRate: '9.99'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handle2FAEnabled = () => {
    setTwoFactorEnabled(true);
    setShow2FA(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Identity', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: 'general', label: 'General', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
    { id: 'products', label: 'Products', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
    { id: 'payments', label: 'Payments', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id: 'shipping', label: 'Shipping', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
    { id: 'notifications', label: 'Notifications', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    { id: 'security', label: 'Security', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  ];

  return (
    <div className={styles.container}>
      {saved && (
        <div className={styles.successToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Settings saved successfully!
        </div>
      )}

      <div className={styles.settingsLayout}>
        {/* Sidebar Tabs */}
        <div className={styles.tabsSidebar}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>
          <form onSubmit={handleSave} className={styles.form}>
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Profile & Identity</h3>
                  <p>Manage how your brand appears to customers</p>
                </div>

                <div className={styles.profileUploadArea}>
                  <div className={styles.avatarWrapper}>
                    <img src={profileImage} alt="Profile" className={styles.avatarPreview} />
                    <div className={styles.avatarOverlay}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.uploadActions}>
                    <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current.click()}>
                      Change Logo
                    </button>
                    <button type="button" className={styles.removeBtn} onClick={() => setProfileImage('')}>
                      Remove
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                  <p className={styles.uploadHint}>Recommended: 500x500px PNG or JPG</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Business Name</label>
                    <input 
                      type="text"
                      name="businessName"
                      value={settings.businessName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Public Handle</label>
                    <input 
                      type="text"
                      name="handle"
                      value={settings.handle}
                      onChange={handleChange}
                      placeholder="@yourstore"
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Contact Email</label>
                  <input 
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Bio / Description</label>
                  <textarea 
                    name="bio"
                    value={settings.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell customers about your brand..."
                  />
                </div>
              </div>
            )}

            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>General Settings</h3>
                  <p>Basic store configuration</p>
                </div>
                
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Currency</label>
                    <select name="currency" value={settings.currency} onChange={handleChange}>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Timezone</label>
                    <select name="timezone" value={settings.timezone} onChange={handleChange}>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Product Defaults</h3>
                  <p>Inventory and listing preferences</p>
                </div>
                
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Low Stock Threshold</label>
                    <input type="number" name="lowStockThreshold" value={settings.lowStockThreshold} onChange={handleChange} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>New Product Status</label>
                    <select name="defaultStatus" value={settings.defaultStatus} onChange={handleChange}>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="active">Active (Visible)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Payments & Checkout</h3>
                  <p>Configure how you get paid</p>
                </div>
                
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}>
                    <span>Auto-fulfill Orders</span>
                    <p>Automatically mark digital orders as fulfilled</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" name="autoFulfill" checked={settings.autoFulfill} onChange={handleChange} />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.inputGroup} style={{ marginTop: '20px' }}>
                  <label>Sales Tax Rate (%)</label>
                  <input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} step="0.1" />
                </div>

                {!isPro && (
                  <div className={styles.proFeature}>
                    <div className={styles.proFeatureIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                    <div className={styles.proFeatureContent}>
                      <h4>Advanced Payments</h4>
                      <p>Unlock multiple gateways and lower transaction fees.</p>
                    </div>
                    <button type="button" className={styles.proFeatureBtn} onClick={onUpgradeClick}>Upgrade Pro</button>
                  </div>
                )}
              </div>
            )}

            {/* SHIPPING TAB */}
            {activeTab === 'shipping' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Shipping & Delivery</h3>
                  <p>Define your shipping rules</p>
                </div>
                
                <div className={styles.inputGroup}>
                  <label>Shipping Origin</label>
                  <input type="text" name="shippingOrigin" value={settings.shippingOrigin} onChange={handleChange} />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Free Shipping Threshold ($)</label>
                    <input type="number" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Flat Rate ($)</label>
                    <input type="number" name="flatRate" value={settings.flatRate} onChange={handleChange} step="0.01" />
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Email Notifications</h3>
                  <p>Choose what emails you receive</p>
                </div>
                
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}>
                    <span>New Order Alerts</span>
                    <p>Get emailed instantly when an order is placed</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleChange} />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}>
                    <span>Weekly Reports</span>
                    <p>Receive a summary of sales every Monday</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Security</h3>
                  <p>Protect your account access</p>
                </div>
                
                <div className={styles.securityOption}>
                  <div className={styles.securityInfo}>
                    <div className={styles.securityIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security</p>
                    </div>
                  </div>
                  <button type="button" className={`${styles.securityBtn} ${twoFactorEnabled ? styles.enabled : ''}`} onClick={() => setShow2FA(true)}>
                    {twoFactorEnabled ? 'Enabled' : 'Enable'}
                  </button>
                </div>

                <div className={styles.dangerZone}>
                  <h4>Danger Zone</h4>
                  <div className={styles.dangerOption}>
                    <div>
                      <h5>Delete Account</h5>
                      <p>Permanently delete your store and data</p>
                    </div>
                    <button type="button" className={styles.deleteBtn}>Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <button type="submit" className={styles.saveBtn}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      {show2FA && (
        <TwoFactorAuth onClose={() => setShow2FA(false)} onEnable={handle2FAEnabled} />
      )}
    </div>
  );
};

export default StudioSettings;