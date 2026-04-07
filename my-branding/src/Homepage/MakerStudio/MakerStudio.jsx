import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import OrderQueue from './OrderQueue'; // Importing the separate modular file
import styles from './MakerStudio.module.css';

const MakerStudio = () => {
  const navigate = useNavigate();

  // --- GLOBAL STUDIO STATE ---
  const [timeFilter, setTimeFilter] = useState('30D');
  const [selectedSizes, setSelectedSizes] = useState(['M']); // Multi-select sizing loop
  const [variants, setVariants] = useState([{ id: Date.now(), color: '', image: null }]);

  // --- HANDLERS ---
  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const addVariant = () => setVariants([...variants, { id: Date.now(), color: '', image: null }]);
  
  const removeVariant = (id) => {
    if (variants.length > 1) setVariants(variants.filter(v => v.id !== id));
  };

  // Mock Data for the Infrastructure
  const transactions = [
    { id: '#TR-9921', brand: 'Aura Studio', amount: '$450.00', status: 'Success', date: 'Feb 12' },
    { id: '#TR-9918', brand: 'Voss Label', amount: '$1,200.00', status: 'Success', date: 'Feb 10' },
    { id: '#TR-9915', brand: 'Elena R.', amount: '$85.00', status: 'Pending', date: 'Feb 08' },
  ];

  const pendingOrders = [
    { id: '8821', customer: 'Aura Studio', items: 50, status: 'Processing', date: 'Feb 12' },
    { id: '8819', customer: 'Voss Label', items: 12, status: 'Queued', date: 'Feb 10' },
  ];

  // --- SUB-COMPONENT: THE MAIN DASHBOARD VIEW ---
  const DashboardView = () => (
    <div className={styles.fadeSlide}>
      {/* 1. TOP COMMAND HEADER */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Maker Dashboard</h1>
          <p className={styles.subtitle}>Atelier Performance & Global Infrastructure</p>
        </div>
        <div className={styles.quickActions}>
          <button className={styles.actionBtn}>Export PDF Report</button>
          <button className={styles.btnPrimary}>+ New Template</button>
        </div>
      </header>

      {/* 2. REVENUE ANALYTICS ENGINE */}
      <section className={styles.analyticsSection}>
        <div className={styles.analyticsHeader}>
          <div className={styles.statLabelArea}>
             <h3>Revenue Performance</h3>
             <span className={styles.growthTag}>+12.4% vs last period</span>
          </div>
          <div className={styles.timeFilters}>
            {['7D', '30D', '3M', 'LIFETIME'].map(range => (
              <button 
                key={range} 
                className={timeFilter === range ? styles.activeRange : ''} 
                onClick={() => setTimeFilter(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.barContainer}>
          {[40, 70, 45, 90, 65, 80, 50, 30, 60, 45, 70, 55].map((h, i) => (
            <div key={i} className={styles.barWrapper}>
              <div className={styles.barFill} style={{ height: `${h}%` }}>
                <div className={styles.barTooltip}>${h * 15} USD</div>
              </div>
              <span className={styles.barDate}>{i + 10} Feb</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MAIN WORKSPACE GRID */}
      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          
          {/* UPLOAD INFRASTRUCTURE FORM */}
          <section className={styles.postSection}>
            <h3 className={styles.capsLabel}>Initialize New Infrastructure</h3>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              
              {/* MULTI-VARIANT IMAGE MANAGER */}
              <div className={styles.variantManager}>
                <label className={styles.fieldLabel}>Media Variants (Colors & Photos)</label>
                <div className={styles.variantGrid}>
                  {variants.map((v) => (
                    <div key={v.id} className={styles.variantCard}>
                      <div className={styles.imageSlot}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                        <p>Upload</p>
                      </div>
                      <input type="text" placeholder="Color Name" className={styles.variantInput} />
                      <button type="button" className={styles.removeVariant} onClick={() => removeVariant(v.id)}>✕</button>
                    </div>
                  ))}
                  <button type="button" className={styles.addVariantBtn} onClick={addVariant}>
                    <span>+</span>
                    <p>Add Color</p>
                  </button>
                </div>
              </div>

              <div className={styles.inputGrid}>
                <div className={styles.field}><label className={styles.fieldLabel}>Technical Title</label><input type="text" placeholder="e.g. 450GSM Boxy Hoodie" /></div>
                <div className={styles.field}><label className={styles.fieldLabel}>Base Price ($)</label><input type="number" placeholder="85.00" /></div>
                <div className={styles.field}><label className={styles.fieldLabel}>Fabric Specification</label><input type="text" placeholder="100% French Terry" /></div>
                <div className={styles.field}><label className={styles.fieldLabel}>Technical Weight</label><input type="text" placeholder="450 GSM" /></div>
              </div>

              {/* MULTI-SIZE SELECTION (THE SIZING LOOP) */}
              <div className={styles.sizeSelection}>
                <label className={styles.fieldLabel}>Available Sizing Loop</label>
                <div className={styles.sizeGrid}>
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button 
                      key={size}
                      type="button"
                      className={`${styles.sizePill} ${selectedSizes.includes(size) ? styles.activeSize : ''}`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Infrastructure Description</label>
                <textarea placeholder="Describe fit, stitch density, and branding limitations..." className={styles.textarea} />
              </div>

              <button type="submit" className={styles.submitBtn}>Publish to Global Catalog</button>
            </form>
          </section>

          {/* LEDGER PREVIEW */}
          <section className={styles.ledgerSection}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.capsLabel}>Transaction Ledger</h3>
                <button className={styles.viewMoreLink} onClick={() => navigate('ledger')}>
                    View Full History &rarr;
                </button>
            </div>
            <div className={styles.ledgerList}>
              {transactions.map(t => (
                <div key={t.id} className={styles.ledgerItem}>
                  <div className={styles.ledgerInfo}>
                    <strong>{t.brand}</strong>
                    <span>{t.id} • {t.date}</span>
                  </div>
                  <div className={styles.ledgerStats}>
                    <span className={styles.amount}>{t.amount}</span>
                    <span className={styles.statusLabel}>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 4. RIGHT COLUMN (LOOP & PRESTIGE) */}
        <div className={styles.rightCol}>
          <section className={styles.orderQueue}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.capsLabel}>Active Loop</h3>
              {/* STYLED PILL BUTTON TAKING YOU TO /queue */}
              <button className={styles.viewQueueBtn} onClick={() => navigate('queue')}>
                <span>VIEW QUEUE</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <div className={styles.queueCard}>
                <div className={styles.qHeader}>
                    <strong>#BRUT-8821</strong>
                    <div className={styles.liveIndicator}>LIVE</div>
                </div>
                <p>Processing • 50 Units</p>
                <div className={styles.miniProgress}><div className={styles.progressFill} style={{width: '65%'}} /></div>
            </div>
          </section>

          <section className={styles.atelierRating}>
             <h3 className={styles.capsLabel}>Atelier Prestige</h3>
             <div className={styles.ratingBox}>
                <h2 className={styles.ratingNum}>4.9</h2>
                <div className={styles.rMeta}>
                    <strong>Global Quality</strong>
                    <p>Top 1% Maker Tier</p>
                </div>
             </div>
             <div className={styles.detailedMetrics}>
                <div className={styles.mLine}><span>Accuracy</span><div className={styles.mBar}><div style={{width: '98%'}} /></div></div>
                <div className={styles.mLine}><span>Speed</span><div className={styles.mBar}><div style={{width: '92%'}} /></div></div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.studioContainer}>
      <Routes>
        {/* Main Dashboard - renders the DashboardView component */}
        <Route path="/" element={<DashboardView />} />
        
        {/* Nested route: /platform/studio/queue - renders the imported OrderQueue file */}
        <Route 
          path="queue" 
          element={<OrderQueue orders={pendingOrders} onBack={() => navigate(-1)} />} 
        />

        {/* Nested route: /platform/studio/ledger */}
        <Route path="ledger" element={
          <div className={styles.fadeSlide}>
             <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back to Dashboard</button>
             <h1 className={styles.title}>Transaction Ledger</h1>
             <div className={styles.fullLedgerTable}>
                <div className={styles.ledgerItem}>
                    <strong>Total Realized Revenue: $42,850.00</strong>
                </div>
                <div className={styles.ledgerList}>
                    {/* Full Ledger content can go here */}
                    <p style={{opacity: 0.4, marginTop: '20px'}}>Full archive history loading...</p>
                </div>
             </div>
          </div>
        } />
      </Routes>
    </div>
  );
};

export default MakerStudio;