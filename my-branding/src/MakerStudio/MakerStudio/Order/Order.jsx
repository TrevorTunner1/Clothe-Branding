import React, { useState } from 'react';
import styles from './Order.module.css';

const Order = () => {
  const [filter, setFilter] = useState('all');
  const [showFullView, setShowFullView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orders, setOrders] = useState([
    { id: 'BR-001', customer: 'Alex M.', email: 'alex@example.com', items: 2, total: '234', status: 'pending', date: '2024-01-15', address: '123 Studio Way, NY' },
    { id: 'BR-002', customer: 'Sarah K.', email: 'sarah@example.com', items: 1, total: '145', status: 'processing', date: '2024-01-14', address: '456 Oak Ave, LA' },
    { id: 'BR-003', customer: 'Mike R.', email: 'mike@example.com', items: 3, total: '354', status: 'shipped', date: '2024-01-13', address: '789 Industrial Pk, TX' },
    { id: 'BR-004', customer: 'Emma L.', email: 'emma@example.com', items: 1, total: '89', status: 'completed', date: '2024-01-12', address: '101 Artisan Rd, CA' },
    { id: 'BR-005', customer: 'James W.', email: 'james@example.com', items: 2, total: '210', status: 'cancelled', date: '2024-01-11', address: '202 Maker St, OR' },
  ]);

  const statuses = ['pending', 'processing', 'shipped', 'completed'];

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const calculateProgressWidth = (status) => {
    const index = statuses.indexOf(status);
    if (index === -1) return 0;
    return (index / (statuses.length - 1)) * 100;
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className={styles.container}>
      {/* HEADER & FILTERS */}
      <div className={styles.header}>
        <h2 className={styles.title}>Infrastructure Ledger</h2>
        <div className={styles.filterWrapper}>
          {['all', ...statuses, 'cancelled'].map(f => (
            <button 
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className={styles.tableWrapper}>
        <div className={styles.scrollArea}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>UNITS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className={styles.bold}>{order.id}</td>
                  <td>
                    <div className={styles.customerBox}>
                      <span className={styles.name}>{order.customer}</span>
                      <span className={styles.email}>{order.email}</span>
                    </div>
                  </td>
                  <td>{order.items}</td>
                  <td className={styles.bold}>${order.total}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.viewBtn} onClick={() => { setSelectedOrder(order); setShowFullView(true); }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL VIEW */}
      {showFullView && selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setShowFullView(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <h2>{selectedOrder.id}</h2>
                <p>Archived: {selectedOrder.date}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowFullView(false)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              {/* TIMELINE */}
              <div className={styles.timelineBox}>
                <div className={styles.lineTrack}>
                    <div 
                        className={styles.lineFill} 
                        style={{ width: `${calculateProgressWidth(selectedOrder.status)}%` }} 
                    />
                </div>
                <div className={styles.steps}>
                  {statuses.map((s, idx) => (
                    <div key={s} className={`${styles.step} ${statuses.indexOf(selectedOrder.status) >= idx ? styles.activeStep : ''}`}>
                      <div className={styles.dot} />
                      <span className={styles.stepLabel}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DATA GRID */}
              <div className={styles.infoGrid}>
                <div className={styles.infoSection}>
                  <label className={styles.capsLabel}>Identity Meta</label>
                  <p><strong>Name:</strong> {selectedOrder.customer}</p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Node:</strong> {selectedOrder.address}</p>
                </div>
                <div className={styles.infoSection}>
                  <label className={styles.capsLabel}>Loop Load</label>
                  <p><strong>Units:</strong> {selectedOrder.items} Garments</p>
                  <p><strong>Total:</strong> <span className={styles.greenText}>${selectedOrder.total}</span></p>
                </div>
              </div>

              {/* STATUS UPDATE */}
              <div className={styles.updateArea}>
                <label className={styles.capsLabel}>Update Infrastructure Status</label>
                <div className={styles.statusGrid}>
                  {statuses.map(s => (
                    <button
                      key={s}
                      className={`${styles.statusOption} ${selectedOrder.status === s ? styles.activeStatus : ''}`}
                      onClick={() => handleStatusChange(selectedOrder.id, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;