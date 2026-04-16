import React from 'react';
import styles from './Products.module.css';

const Products = () => {
  const products = [
    { id: 1, name: '450GSM Heavyweight Tee', price: 89, status: 'active', stock: 45, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { id: 2, name: 'Techwear Cargo Pants', price: 145, status: 'active', stock: 23, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400' },
    { id: 3, name: 'Oversized Hoodie', price: 120, status: 'draft', stock: 0, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" placeholder="Search products..." />
        </div>
        <div className={styles.filters}>
          <button className={styles.filterBtn}>All</button>
          <button className={styles.filterBtn}>Active</button>
          <button className={styles.filterBtn}>Draft</button>
        </div>
      </div>

      <div className={styles.productsGrid}>
        {products.map(product => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imageWrapper}>
              <img src={product.image} alt={product.name} />
              <span className={`${styles.status} ${styles[product.status]}`}>
                {product.status}
              </span>
            </div>
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <div className={styles.meta}>
                <span className={styles.price}>${product.price}</span>
                <span className={styles.stock}>{product.stock} in stock</span>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.actionBtn}>Edit</button>
              <button className={styles.actionBtn}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;