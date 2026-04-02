import React, { useState } from 'react';
import styles from './ProfileSettings.module.css';

const ProfileSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'Brutige User',
    email: 'user@brutige.com',
    phone: '+234 800 000 0000',
    address: 'Port Harcourt, Rivers State',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    twoFactor: true
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: 'security', label: 'Security', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { id: 'notifications', label: 'Notifications', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    { id: 'billing', label: 'Billing', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id: 'info', label: 'Support & Info', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.settingsLayout}>
        {/* Sidebar Navigation */}
        <aside className={styles.settingsSidebar}>
          <h2 className={styles.mainTitle}>Settings</h2>
          <nav className={styles.navMenu}>
            {sections.map(section => (
              <button
                key={section.id}
                className={`${styles.navItem} ${activeSection === section.id ? styles.activeNav : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className={styles.settingsContent}>
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Profile Information</h3>
              <div className={styles.profileCard}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatarLarge}><span>B</span></div>
                  <div className={styles.avatarActions}>
                    <button className={styles.btnSecondary}>Change Photo</button>
                    <button className={styles.btnText}>Remove</button>
                  </div>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}><label>Full Name</label><input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Email Address</label><input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Phone Number</label><input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Location</label><input type="text" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} /></div>
                </div>
                <div className={styles.formActions}>
                  <button className={styles.btnPrimary}>Save Changes</button>
                  <button className={styles.btnText}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Security Settings</h3>
              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}><h4>Two-Factor Authentication</h4><p>Add an extra layer of security to your account</p></div>
                  <label className={styles.switch}><input type="checkbox" checked={formData.twoFactor} onChange={(e) => handleInputChange('twoFactor', e.target.checked)}/><span className={styles.slider}></span></label>
                </div>
                <div className={styles.settingItem}><div className={styles.settingInfo}><h4>Change Password</h4><p>Update your account password</p></div><button className={styles.btnSecondary}>Update</button></div>
                <div className={styles.settingItem}><div className={styles.settingInfo}><h4>Login Activity</h4><p>View recent login history</p></div><button className={styles.btnSecondary}>View</button></div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Notification Preferences</h3>
              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}><h4>Email Notifications</h4><p>Receive updates via email</p></div>
                  <label className={styles.switch}><input type="checkbox" checked={formData.notifications.email} onChange={(e) => setFormData(prev => ({...prev, notifications: { ...prev.notifications, email: e.target.checked }}))}/><span className={styles.slider}></span></label>
                </div>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}><h4>Push Notifications</h4><p>Receive push notifications on devices</p></div>
                  <label className={styles.switch}><input type="checkbox" checked={formData.notifications.push} onChange={(e) => setFormData(prev => ({...prev, notifications: { ...prev.notifications, push: e.target.checked }}))}/><span className={styles.slider}></span></label>
                </div>
              </div>
            </div>
          )}

          {/* Billing Section */}
          {activeSection === 'billing' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Billing & Payment</h3>
              <div className={styles.billingCard}>
                <div className={styles.cardHeader}><h4>Payment Methods</h4><button className={styles.btnPrimary}>Add New</button></div>
                <div className={styles.paymentList}>
                  <div className={styles.paymentItem}>
                    <div className={styles.cardIcon}><svg width="32" height="24" fill="none"><rect width="32" height="24" rx="4" fill="currentColor"/><rect x="2" y="4" width="28" height="4" fill="var(--brut-bg)" opacity="0.3"/></svg></div>
                    <div className={styles.cardInfo}><h5>•••• 4242</h5><p>Expires 12/25</p></div>
                    <span className={styles.defaultBadge}>Default</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW Support & Info Section (FOOTER LINKS) */}
          {activeSection === 'info' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Platform Information</h3>
              <div className={styles.infoCard}>
                <div className={styles.linksGrid}>
                  <div className={styles.linkCol}>
                    <h4>Platform</h4>
                    <a href="#collections">Collections</a>
                    <a href="#process">How it Works</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#showcase">Showcase</a>
                  </div>
                  <div className={styles.linkCol}>
                    <h4>Resources</h4>
                    <a href="#faq">FAQ</a>
                    <a href="#blog">Blog</a>
                    <a href="#guides">Design Guides</a>
                    <a href="#support">Support</a>
                  </div>
                  <div className={styles.linkCol}>
                    <h4>Contact</h4>
                    <a href="mailto:hello@brutige.com">hello@brutige.com</a>
                    <span>+1 (555) 123-4567</span>
                    <span>San Francisco, CA</span>
                  </div>
                </div>
                <div className={styles.legalFooter}>
                  <p>&copy; 2024 Brutige. All rights reserved.</p>
                  <div className={styles.legalLinks}>
                    <a href="#privacy">Privacy</a> • <a href="#terms">Terms</a> • <a href="#cookies">Cookies</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;