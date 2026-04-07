import React, { useState } from 'react';
import styles from './OrderQueue.module.css';

const OrderQueue = ({ orders, onBack }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'Processing', 'Queued', 'Shipped', 'Delivered'];

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'All' || order.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <section className={styles.orderQueueContainer}>
      {/* 1. ARCHITECTURAL HEADER */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <button className={styles.backBtn} onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>Back</span>
          </button>
          <h1 className={styles.mainTitle}>Infrastructure Queue</h1>
        </div>
        
        <div className={styles.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Search by ID or Customer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 2. TECHNICAL FILTERS */}
      <div className={styles.filterBar}>
        {filters.map(f => (
          <button 
            key={f} 
            className={`${styles.filterPill} ${filter === f ? styles.activeFilter : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 3. THE QUEUE LIST */}
      <div className={styles.queueList}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, i) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderTop}>
                <div className={styles.orderIdSection}>
                  <div className={styles.idBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    <strong>ID: {order.id}</strong>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className={styles.orderBody}>
                <div className={styles.customerBox}>
                    <p className={styles.customerLabel}>Customer Atelier</p>
                    <h4 className={styles.customerName}>{order.customer}</h4>
                </div>
                <div className={styles.unitBox}>
                    <p className={styles.customerLabel}>Branding Load</p>
                    <h4 className={styles.orderDetails}>{order.items} Units</h4>
                </div>
              </div>

              {/* TECHNICAL TIMELINE PROGRESS */}
              <div className={styles.timelineArea}>
                <div className={styles.timelineTrack}>
                    <div className={styles.timelineFill} style={{ width: order.status === 'Processing' ? '60%' : '20%' }} />
                </div>
                <div className={styles.timelineLabels}>
                    <span>Sourcing</span>
                    <span>Branding</span>
                    <span>Quality Check</span>
                </div>
              </div>

              <div className={styles.orderBottom}>
                <span className={styles.timestamp}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  {order.date}
                </span>
                <div className={styles.actionGroup}>
                    <button className={styles.printBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                      <span>Slip</span>
                    </button>
                    <button className={styles.manageBtn}>Manage</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyQueue}>
            <p>No infrastructure requests match your current filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderQueue;