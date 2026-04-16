import React from 'react';
import styles from './Transaction.module.css';

const Transaction = () => {
  const transactions = [
    { id: 'TXN-001', date: '2024-01-15', customer: 'John Doe', type: 'Sale', amount: 89, status: 'completed' },
    { id: 'TXN-002', date: '2024-01-14', customer: 'Jane Smith', type: 'Sale', amount: 145, status: 'completed' },
    { id: 'TXN-003', date: '2024-01-14', customer: 'Mike Johnson', type: 'Refund', amount: -89, status: 'completed' },
    { id: 'TXN-004', date: '2024-01-13', customer: 'Sarah Williams', type: 'Sale', amount: 234, status: 'pending' },
    { id: 'TXN-005', date: '2024-01-12', customer: 'Tom Brown', type: 'Sale', amount: 120, status: 'completed' },
  ];

  const totalSales = transactions
    .filter(t => t.type === 'Sale' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter(t => t.type === 'Refund')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className={styles.container}>
      {/* Summary Cards */}
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.label}>Total Sales</span>
          <span className={styles.value}>${totalSales.toLocaleString()}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.label}>Total Refunds</span>
          <span className={`${styles.value} ${styles.negative}`}>${totalRefunds.toLocaleString()}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.label}>Net Revenue</span>
          <span className={styles.value}>${(totalSales - totalRefunds).toLocaleString()}</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h3>Recent Transactions</h3>
          <button className={styles.exportBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id}>
                <td className={styles.txnId}>{txn.id}</td>
                <td>{txn.date}</td>
                <td>{txn.customer}</td>
                <td>
                  <span className={`${styles.type} ${styles[txn.type.toLowerCase()]}`}>
                    {txn.type}
                  </span>
                </td>
                <td className={txn.amount < 0 ? styles.negative : styles.positive}>
                  {txn.amount < 0 ? '-' : ''}${Math.abs(txn.amount).toLocaleString()}
                </td>
                <td>
                  <span className={`${styles.status} ${styles[txn.status]}`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaction;