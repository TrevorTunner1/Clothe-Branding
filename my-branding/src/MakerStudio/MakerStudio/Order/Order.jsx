import React, { useState } from 'react';
import styles from './Order.module.css';

const Order = () => {
  const [status, setStatus] = useState('all');
  
  const orders = [
    { id: '#BR-2024-001', customer: 'Alex M.', date: '2024-10-24', total: 245, status: 'pending', items: 3 },
    { id: '#BR-2024-002', customer: 'Sarah K.', date: '2024-10-23', total: 89, status: 'shipped', items: 1 },
    { id: '#BR-2024-003', customer: 'Mike R.', date: '2024-10-23', total: 412, status: 'delivered', items: 5 },
    { id: '#BR-2024-004', customer: 'Emma L.', date: '2024-10-22', total: 156, status: 'pending', items: 2 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return styles.pending;
      case 'shipped': return styles.shipped;
      case 'delivered': return styles.delivered;
      default: return '';
    }
  };

  return (
    <div className={styles.orders}>
      <header className={styles.header}>
        <div>
          <h1>Orders</h1>
          <p>Manage and fulfill orders</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>12</span>
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>48</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${status === 'all' ? styles.active : ''}`} onClick={() => setStatus('all')}>All Orders</button>
          <button className={`${styles.tab} ${status === 'pending' ? styles.active : ''}`} onClick={() => setStatus('pending')}>Pending</button>
          <button className={`${styles.tab} ${status === 'shipped' ? styles.active : ''}`} onClick={() => setStatus('shipped')}>Shipped</button>
          <button className={`${styles.tab} ${status === 'delivered' ? styles.active : ''}`} onClick={() => setStatus('delivered')}>Delivered</button>
        </div>
        <button className={styles.exportBtn}>Export CSV</button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span>Order ID</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Items</span>
          <span>Total</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {orders.map(order => (
          <div key={order.id} className={styles.tableRow}>
            <span className={styles.orderId}>{order.id}</span>
            <span className={styles.customer}>{order.customer}</span>
            <span className={styles.date}>{order.date}</span>
            <span className={styles.items}>{order.items}</span>
            <span className={styles.total}>€{order.total}</span>
            <span className={`${styles.status} ${getStatusColor(order.status)}`}>{order.status}</span>
            <button className={styles.actionBtn}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;