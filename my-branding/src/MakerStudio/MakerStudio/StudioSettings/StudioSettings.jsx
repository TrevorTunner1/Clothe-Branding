import React, { useState } from 'react';
import styles from './StudioSettings.module.css';

const StudioSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    storeName: 'Aura Studio',
    email: 'hello@aurastudio.com',
    currency: 'USD',
    timezone: 'America/New_York',
    notifications: true,
    autoFulfill: false,
    taxRate: '8.5'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'payments', label: 'Payments' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'notifications', label: 'Notifications' },
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

      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className={styles.form}>
        {activeTab === 'general' && (
          <div className={styles.section}>
            <h3>General Settings</h3>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Store Name</label>
                <input 
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Contact Email</label>
                <input 
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Currency</label>
                <select name="currency" value={settings.currency} onChange={handleChange}>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Timezone</label>
                <select name="timezone" value={settings.timezone} onChange={handleChange}>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Default Tax Rate (%)</label>
                <input 
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
            </div>

            <div className={styles.toggles}>
              <label className={styles.toggle}>
                <input 
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                />
                <span className={styles.toggleSlider} />
                <span>Enable email notifications</span>
              </label>

              <label className={styles.toggle}>
                <input 
                  type="checkbox"
                  name="autoFulfill"
                  checked={settings.autoFulfill}
                  onChange={handleChange}
                />
                <span className={styles.toggleSlider} />
                <span>Auto-fulfill orders</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className={styles.section}>
            <h3>Payment Settings</h3>
            <p className={styles.comingSoon}>Payment integration settings coming soon...</p>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className={styles.section}>
            <h3>Shipping Settings</h3>
            <p className={styles.comingSoon}>Shipping configuration coming soon...</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className={styles.section}>
            <h3>Notification Preferences</h3>
            <p className={styles.comingSoon}>Notification settings coming soon...</p>
          </div>
        )}

        <button type="submit" className={styles.saveBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default StudioSettings;