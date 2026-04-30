import React, { useState, useRef, useEffect } from 'react';
import styles from './ProfileSettings.module.css';
import { countryCodes, searchCountryCodes } from "../../data/countryCodes";
import { languages } from '../../data/languages';
import { timezones } from '../../data/timezones';
import { useAuthStore, api } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ProfileSettings = ({ userProfile, setUserProfile, userType = 'customer' }) => {
  const fileInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Country code search
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  // Location loading state
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();


  // Account Data - synced with ProfileView

  const [isEditing, setIsEditing] = useState(false);



  const [accountData, setAccountData] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    displayName: userProfile?.displayName || '',
    username: userProfile?.username || '',
    email: userProfile?.email || '',
    phoneNumber: userProfile?.phoneNumber || '',
    location: userProfile?.location || '',
    timezone: userProfile?.timezone || 'UTC',
    language: userProfile?.language || 'en',
    bio: userProfile?.bio || '',
    avatar: userProfile?.avatar || null
  });


  const saveAccountDataHandler = async () => {
    try {
      await api.patch("/api/v1/platform/profile", {
        fullName: accountData.displayName || '',
        username: accountData.username || '',
        email: accountData.email || '',
        profilePicture: accountData.avatar || '',
        firstName: accountData.firstName || '',
        lastName: accountData.lastName || '',
        userDescription: accountData.bio || '',
        addresses: [{
          phoneNumber: accountData.phoneNumber || '',
          country: accountData.location || '',
          addressType: 'HOME',
        }]
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const fetchAccountDataHandler = async () => {
    await api.get("/api/v1/platform/profile")
      .then(res => {
        const data = res.data;

        const firstAddress = data.addresses?.[0];  // ← get first address

        console.log(data);

        setAccountData(prev => ({
          ...prev,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          displayName: data.fullName || '',
          username: data.username || '',
          email: data.email || '',
          bio: data.userDescription || '',
          phoneNumber: firstAddress?.phoneNumber || '',  // ← from address
          location: firstAddress?.country || '',        // ← from address
        }))
      })
      .catch(err => {
        console.error('Failed to fetch profile', err.response?.data || err.message);
      });
  }

  useEffect(() => {
    fetchAccountDataHandler();
  }, []);

  const cancelAccountHandler = () => {
    setIsEditing(false);
  }




  // Security Data
  const [securityData, setSecurityData] = useState({
    twoFactor: false,
    publicProfile: true,
    loginAlerts: true,
    activeSessions: [
      { device: 'Chrome on Windows', location: 'New York, USA', lastActive: '2 hours ago', current: true },
      { device: 'Safari on iPhone', location: 'New York, USA', lastActive: '1 day ago', current: false }
    ]
  });

  // Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    orders: { email: true, push: true, sms: false },
    messages: { email: true, push: true, sms: false },
    marketing: { email: false, push: false, sms: false },
    system: { email: true, push: true, sms: false }
  });

  // Billing Data
  const [billingData, setBillingData] = useState({
    paymentMethods: [
      { id: 1, type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25', default: true }
    ],
    billingHistory: [
      { id: 1, date: '2024-10-24', description: 'Pro Plan - Monthly', amount: 29.00, status: 'paid' }
    ]
  });

  // Filtered country codes based on search
  const filteredCountries = countrySearch
    ? searchCountryCodes(countrySearch)
    : countryCodes;

  // Sections configuration - different for makers and customers
  const getSections = () => {
    const baseSections = [
      {
        id: 'account', label: 'Account', icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        )
      },
      {
        id: 'security', label: 'Security', icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        )
      },
      {
        id: 'notifications', label: 'Notifications', icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        )
      },
      {
        id: 'billing', label: 'Billing', icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        )
      },
      {
        id: 'support', label: 'Support', icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )
      },
      {
        id: 'logout', label: 'logout', icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )
      }
    ];

    // Add Business section only for makers
    if (userType === 'maker') {
      baseSections.splice(1, 0, {
        id: 'business',
        label: 'Business',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          </svg>
        )
      });
    }

    return baseSections;
  };

  // Get user's exact location
  const getExactLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Reverse geocoding using OpenStreetMap
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();

          if (data && data.display_name) {
            // Extract city and country
            const address = data.address;
            const city = address.city || address.town || address.village || address.suburb || '';
            const country = address.country || '';
            const locationString = city && country ? `${city}, ${country}` : data.display_name;

            setAccountData(prev => ({ ...prev, location: locationString }));
          }
        } catch (error) {
          setLocationError('Could not fetch location details');
        }
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMsg = 'Could not get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out';
            break;
        }
        setLocationError(errorMsg);
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle input changes and sync with parent
  const handleInputChange = (field, value) => {
    setAccountData(prev => {
      const updated = { ...prev, [field]: value };
      // Sync with parent component (ProfileView)
      if (setUserProfile) {
        setUserProfile(updated);
      }
      return updated;
    });
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setCountrySearch('');
  };

  // Handle phone number change
  const handlePhoneChange = (value) => {
    // Remove non-numeric characters except +
    const cleaned = value.replace(/[^\d+]/g, '');
    handleInputChange('phoneNumber', cleaned);
  };

  // Save changes
  const handleSave = async (section) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log(`Saving ${section} data:`,
      section === 'account' ? accountData :
        section === 'security' ? securityData :
          section === 'notifications' ? notificationPrefs : billingData
    );

    setIsLoading(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Handle notification change
  const handleNotificationChange = (category, method, value) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [category]: { ...prev[category], [method]: value }
    }));
  };

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.phoneInputWrapper}`)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sections = getSections();

  const logoutHandler = async () => {
    await logout();
    return navigate('/login', { replace: true })
  }

  return (
    <div className={styles.container}>
      {/* Success Toast */}
      {saveSuccess && (
        <div className={styles.successToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Changes saved successfully!
        </div>
      )}

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

          {/* ACCOUNT SECTION */}
          {activeSection === 'account' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Account Information</h3>
                <span className={styles.sectionDesc}>Manage your personal details and preferences</span>
              </div>

              <div className={styles.card}>
                {/* Avatar Upload */}
                <div className={styles.avatarSection}>
                  <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
                    {accountData.avatar ? (
                      <img src={accountData.avatar} alt="Profile" className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                    <div className={styles.avatarOverlay}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
                    <input
                      type="text"
                      value={accountData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={accountData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Display Name</label>
                    <input
                      type="text"
                      value={accountData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="How you appear publicly"
                      disabled={!isEditing}
                    />
                    <span className={styles.hint}>This is how your name appears on your profile</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Username</label>
                    <div className={styles.inputWithPrefix}>
                      <span className={styles.prefix}>@</span>
                      <input
                        type="text"
                        value={accountData.username}
                        onChange={(e) => handleInputChange('username', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                        placeholder="username"
                        disabled={!isEditing}
                      />
                    </div>
                    <span className={styles.hint}>Can be changed anytime</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={accountData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <div className={styles.phoneInputWrapper}>
                      <button
                        className={styles.countryCodeBtn}
                        onClick={() => isEditing && setShowCountryDropdown(!showCountryDropdown)}
                        type="button"
                        disabled={!isEditing}
                      >
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {showCountryDropdown && isEditing && (
                        <div className={styles.countryDropdown}>
                          <div className={styles.countrySearch}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="11" cy="11" r="8" />
                              <path d="m21 21-4.3-4.3" />
                            </svg>
                            <input
                              type="text"
                              placeholder="Search country or code..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className={styles.countryList}>
                            {filteredCountries.map((country, idx) => (
                              <button
                                key={`${country.code}-${idx}`}
                                className={styles.countryOption}
                                onClick={() => handleCountrySelect(country)}
                                type="button"
                              >
                                <span className={styles.countryFlag}>{country.flag}</span>
                                <span className={styles.countryName}>{country.country}</span>
                                <span className={styles.countryCode}>{country.code}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <input
                        type="tel"
                        value={accountData.phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="Phone number"
                        className={styles.phoneInput}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className={styles.formGroup}>
                    <label>Location</label>
                    <div className={styles.locationInputWrapper}>
                      <input
                        type="text"
                        value={accountData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, Country"
                        disabled={!isEditing}
                      />
                      <button
                        className={styles.locationBtn}
                        onClick={getExactLocation}
                        disabled={!isEditing || isGettingLocation}
                        type="button"
                        title="Get my exact location"
                      >
                        {isGettingLocation ? (
                          <span className={styles.spinner} />
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {locationError && <span className={styles.errorText}>{locationError}</span>}
                  </div>

                  {/* Language */}
                  <div className={styles.formGroup}>
                    <label>Language</label>
                    <select
                      value={accountData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className={styles.select}
                      disabled={!isEditing}
                    >
                      {languages.map((lang, idx) => (
                        <option key={`${lang.code}-${idx}`} value={lang.code}>
                          {lang.nativeName} ({lang.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timezone */}
                  <div className={styles.formGroup}>
                    <label>Timezone</label>
                    <select
                      value={accountData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className={styles.select}
                      disabled={!isEditing}
                    >
                      {timezones.map((tz, idx) => (
                        <option key={`${tz.value}-${idx}`} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Bio</label>
                    <textarea
                      rows="3"
                      value={accountData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      className={styles.textarea}
                      disabled={!isEditing}
                    />
                    <span className={styles.hint}>Brief description visible on your profile</span>
                  </div>
                </div>

                <div className={styles.formActions}>
                  {
                    isEditing ? (
                      <>
                        <button
                          className={styles.btnPrimary}
                          onClick={saveAccountDataHandler}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={cancelAccountHandler}
                          className={styles.btnText}>Cancel</button>
                      </>
                    ) : (
                      <button className={styles.btnSecondary} onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          )}

          {/* BUSINESS SECTION - Only for Makers */}
          {activeSection === 'business' && userType === 'maker' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Business Details</h3>
                <span className={styles.sectionDesc}>Your maker studio information</span>
              </div>

              <div className={styles.card}>
                <div className={styles.comingSoonContent}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <h4>Manage your business in Maker Studio</h4>
                  <p>Business settings have been moved to your Maker Studio dashboard for better management.</p>
                  <button className={styles.btnPrimary}>Go to Maker Studio</button>
                </div>
              </div>
            </div>
          )}

          {/* BUSINESS SECTION - For Customers (Upgrade Prompt) */}
          {activeSection === 'business' && userType === 'customer' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Become a Maker</h3>
                <span className={styles.sectionDesc}>Start selling on Brutige</span>
              </div>

              <div className={styles.card}>
                <div className={styles.upgradeContent}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  <h4>Unlock Business Features</h4>
                  <p>Upgrade your account to become a maker and start selling your products on Brutige.</p>
                  <ul className={styles.featureList}>
                    <li>Create and manage products</li>
                    <li>Process orders and payments</li>
                    <li>Access analytics and insights</li>
                    <li>Connect with customers</li>
                  </ul>
                  <button className={styles.btnPrimary}>Upgrade to Maker Account</button>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeSection === 'security' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Security</h3>
                <span className={styles.sectionDesc}>Protect your account</span>
              </div>

              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={securityData.twoFactor}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Redirect to 2FA setup
                          alert('Redirecting to 2FA setup...');
                        }
                        // setSecurityData(prev => ({ ...prev, twoFactor: e.target.checked }));
                      }}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h4>Public Profile</h4>
                    <p>Make your profile visible to others</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={securityData.publicProfile}
                      onChange={(e) => {
                        setSecurityData(prev => ({ ...prev, publicProfile: e.target.checked }));
                      }}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h4>Login Alerts</h4>
                    <p>Get notified of new sign-ins</p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={securityData.loginAlerts}
                      onChange={(e) => {
                        setSecurityData(prev => ({ ...prev, loginAlerts: e.target.checked }));
                      }}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.card} style={{ marginTop: '32px' }}>
                <h4 className={styles.subSectionTitle}>Active Sessions</h4>
                <div className={styles.sessionsList}>
                  {securityData.activeSessions.map((session, idx) => (
                    <div key={idx} className={styles.sessionItem}>
                      <div className={styles.sessionInfo}>
                        <div className={styles.sessionDevice}>{session.device}</div>
                        <div className={styles.sessionMeta}>
                          {session.location} • {session.lastActive}
                          {session.current && <span className={styles.currentBadge}>Current</span>}
                        </div>
                      </div>
                      {!session.current && (
                        <button className={styles.btnText}>Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.card} style={{ marginTop: '32px' }}>
                <h4 className={styles.subSectionTitle}>Password</h4>
                <div className={styles.settingItem} style={{ border: 'none', padding: '16px 0' }}>
                  <div className={styles.settingInfo}>
                    <h4>Change Password</h4>
                    <p>Last updated 3 months ago</p>
                  </div>
                  <button className={styles.btnSecondary}>Update Password</button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SECTION */}
          {activeSection === 'notifications' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Notifications</h3>
                <span className={styles.sectionDesc}>Choose how you want to be notified</span>
              </div>

              <div className={styles.card}>
                <div className={styles.notificationHeader}>
                  <span>Category</span>
                  <span className={styles.channelLabel}>Email</span>
                  <span className={styles.channelLabel}>Push</span>
                  <span className={styles.channelLabel}>SMS</span>
                </div>

                {Object.entries(notificationPrefs).map(([category, methods]) => (
                  <div key={category} className={styles.notificationRow}>
                    <div className={styles.notificationCategory}>
                      <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                      <p>
                        {category === 'orders' && 'New orders, shipping updates'}
                        {category === 'messages' && 'Direct messages'}
                        {category === 'marketing' && 'Tips and offers'}
                        {category === 'system' && 'Security alerts'}
                      </p>
                    </div>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={methods.email}
                        onChange={(e) => handleNotificationChange(category, 'email', e.target.checked)}
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={methods.push}
                        onChange={(e) => handleNotificationChange(category, 'push', e.target.checked)}
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={methods.sms}
                        onChange={(e) => handleNotificationChange(category, 'sms', e.target.checked)}
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                  </div>
                ))}

                <div className={styles.formActions} style={{ marginTop: '24px' }}>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => handleSave('notifications')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BILLING SECTION */}
          {activeSection === 'billing' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Billing & Payments</h3>
                <span className={styles.sectionDesc}>Manage payment methods</span>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeaderRow}>
                  <h4 className={styles.subSectionTitle}>Payment Methods</h4>
                  <button className={styles.btnSecondary}>Add Payment Method</button>
                </div>
                <div className={styles.paymentList}>
                  {billingData.paymentMethods.map(method => (
                    <div key={method.id} className={styles.paymentItem}>
                      <div className={styles.paymentIcon}>
                        {method.type === 'card' ? (
                          <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                            <rect width="32" height="24" rx="4" fill="currentColor" />
                            <rect x="2" y="4" width="28" height="4" fill="var(--brut-bg)" opacity="0.3" />
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 1 4 4v5" />
                            <circle cx="17.5" cy="7.5" r="2.5" />
                          </svg>
                        )}
                      </div>
                      <div className={styles.paymentDetails}>
                        <h5>
                          {method.type === 'card' ? `•••• ${method.last4}` : method.email}
                          {method.default && <span className={styles.defaultBadge}>Default</span>}
                        </h5>
                        <p>{method.type === 'card' ? `Expires ${method.expiry}` : 'PayPal Account'}</p>
                      </div>
                      <button className={styles.btnText}>Edit</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.card} style={{ marginTop: '24px' }}>
                <div className={styles.cardHeaderRow}>
                  <h4 className={styles.subSectionTitle}>Billing History</h4>
                  <button className={styles.btnText}>Download All</button>
                </div>
                <div className={styles.billingList}>
                  {billingData.billingHistory.map(item => (
                    <div key={item.id} className={styles.billingItem}>
                      <div className={styles.billingInfo}>
                        <div className={styles.billingDesc}>{item.description}</div>
                        <div className={styles.billingDate}>{item.date}</div>
                      </div>
                      <div className={styles.billingAmount}>
                        <span>${item.amount.toFixed(2)}</span>
                        <span className={`${styles.statusBadge} ${styles[item.status]}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUPPORT SECTION */}
          {activeSection === 'support' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Help & Support</h3>
                <span className={styles.sectionDesc}>Resources and assistance</span>
              </div>

              <div className={styles.supportCard}>
                <div className={styles.supportGrid}>
                  <div className={styles.supportCol}>
                    <h4>Platform</h4>
                    <ul>
                      <li><a href="/collections">Collections</a></li>
                      <li><a href="/how-it-works">How it Works</a></li>
                      <li><a href="/pricing">Pricing</a></li>
                      <li><a href="/showcase">Showcase</a></li>
                      <li><a href="/templates">Templates</a></li>
                    </ul>
                  </div>

                  <div className={styles.supportCol}>
                    <h4>Resources</h4>
                    <ul>
                      <li><a href="/faq">FAQ</a></li>
                      <li><a href="/blog">Blog</a></li>
                      <li><a href="/guides">Design Guides</a></li>
                      <li><a href="/api-docs">API Documentation</a></li>
                      <li><a href="/community">Community Forum</a></li>
                    </ul>
                  </div>

                  <div className={styles.supportCol}>
                    <h4>Contact</h4>
                    <ul>
                      <li><a href="mailto:hello@brutige.com">hello@brutige.com</a></li>
                      <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
                      <li><span>San Francisco, CA</span></li>
                      <li><a href="/contact">Contact Form</a></li>
                      <li><a href="/status">System Status</a></li>
                    </ul>
                  </div>
                </div>

                <div className={styles.legalSection}>
                  <div className={styles.legalLinks}>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/cookies">Cookie Policy</a>
                    <a href="/accessibility">Accessibility</a>
                  </div>
                  <p className={styles.copyright}>&copy; 2024 Brutige. All rights reserved.</p>
                </div>
              </div>
            </div>
          )}



          {/* SUPPORT SECTION */}
          {activeSection === 'logout' && (
            <div className='logutModel'>
              <button onClick={logoutHandler}>logout twin</button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;