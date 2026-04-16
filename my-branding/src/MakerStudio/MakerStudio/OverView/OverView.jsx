import React from 'react';
import styles from './OverView.module.css';

const OverView = () => {
  const stats = [
    { label: 'Total Sales', value: '$12,450', change: '+23%', positive: true },
    { label: 'Orders', value: '156', change: '+12%', positive: true },
    { label: 'Products', value: '24', change: '+3', positive: true },
    { label: 'Views', value: '8.2K', change: '-5%', positive: false },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', product: '450GSM Heavyweight Tee', amount: 89, status: 'completed' },
    { id: '#ORD-002', customer: 'Jane Smith', product: 'Techwear Cargo Pants', amount: 145, status: 'processing' },
    { id: '#ORD-003', customer: 'Mike Johnson', product: 'Oversized Hoodie', amount: 120, status: 'pending' },
  ];

  return (
    <div className={styles.container}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <div className={styles.statValue}>
              <span className={styles.value}>{stat.value}</span>
              <span className={`${styles.change} ${stat.positive ? styles.positive : styles.negative}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Recent Orders</h3>
          <button className={styles.viewAll}>View All</button>
        </div>
        <div className={styles.ordersList}>
          {recentOrders.map(order => (
            <div key={order.id} className={styles.orderRow}>
              <div className={styles.orderInfo}>
                <span className={styles.orderId}>{order.id}</span>
                <span className={styles.customer}>{order.customer}</span>
              </div>
              <span className={styles.product}>{order.product}</span>
              <span className={styles.amount}>${order.amount}</span>
              <span className={`${styles.orderStatus} ${styles[order.status]}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h3>Quick Actions</h3>
        <div className={styles.quickActions}>
          <button className={styles.quickBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Product
          </button>
          <button className={styles.quickBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            View Orders
          </button>
          <button className={styles.quickBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
            </svg>
            Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverView;