import React, { useState } from 'react';
import styles from './CartView.module.css';

const CartView = ({ cartItems, updateQuantity, removeItem, toggleSaved }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState(1); // NEW: Multi-step indicator (1 to 4)

  // Infrastructure Constants
  const FREE_SHIPPING_THRESHOLD = 100;
  
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  // NEW: Free Shipping Progress Logic
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'BRUTIGE10') {
      setDiscount(subtotal * 0.1);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.illustrationBox}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>
              <circle cx="12" cy="14" r="1" fill="currentColor"/>
            </svg>
        </div>
        <h2>Your Cart is Empty</h2>
        <p>Your branding infrastructure awaits. Start adding items to continue.</p>
        <button className={styles.continueBtn} onClick={() => window.location.href='/platform/shop'}>
            Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* NEW: Multi-Step Progress Indicator */}
      <div className={styles.checkoutSteps}>
        {['Cart', 'Information', 'Shipping', 'Payment'].map((label, i) => (
            <div key={label} className={`${styles.step} ${checkoutStep > i ? styles.stepActive : ''}`}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span className={styles.stepLabel}>{label}</span>
                {i < 3 && <div className={styles.stepLine} />}
            </div>
        ))}
      </div>

      <div className={styles.cartLayout}>
        <div className={styles.itemsSection}>
          <h2 className={styles.title}>Infrastructure Loop ({cartItems.length})</h2>
          
          {/* NEW: Free Shipping Progress Bar */}
          <div className={styles.shippingNotice}>
            <p>
                {amountToFree > 0 
                  ? `Add $${amountToFree.toFixed(2)} more for Free Global Shipping` 
                  : "✓ You've unlocked Free Global Shipping"}
            </p>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${freeShippingProgress}%` }} />
            </div>
          </div>

          <div className={styles.itemsList}>
            {cartItems.map((item, index) => {
              const itemPrice = parseFloat(item.price.replace('$', ''));
              const itemTotal = itemPrice * item.quantity;

              return (
                <div key={`${item.id}-${item.size}-${index}`} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.img} alt={item.title} />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                        <h3>{item.title}</h3>
                        {/* NEW: Stock Warning (Mock Logic) */}
                        {item.quantity > 2 && <span className={styles.stockWarning}>Only 3 left in stock</span>}
                    </div>
                    <p className={styles.itemSize}>Size: {item.size}</p>
                    <p className={styles.itemPrice}>${itemPrice.toFixed(2)}</p>
                    
                    {/* NEW: Save for Later / Quick Edit */}
                    <div className={styles.itemLinks}>
                        <button onClick={() => toggleSaved(item)} className={styles.linkBtn}>Save for later</button>
                        <button className={styles.linkBtn}>Edit Details</button>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>

                    <p className={styles.itemTotal}>${itemTotal.toFixed(2)}</p>

                    <button className={styles.removeBtn} onClick={() => removeItem(item.id, item.size)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>

            {/* NEW: Estimated Delivery Indicator */}
            <div className={styles.deliveryEstimate}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <span>Estimated Delivery: <strong>Feb 12 - Feb 15</strong></span>
            </div>

            <div className={styles.promoSection}>
              <input type="text" placeholder="Infrastructure Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <button onClick={applyPromo}>Apply</button>
            </div>

            {discount > 0 && (
              <div className={styles.discountApplied}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Discount applied: 10% OFF</span>
              </div>
            )}

            <div className={styles.summaryLine}><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div className={styles.summaryLine}><span>Shipping</span><strong>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</strong></div>
            <div className={styles.summaryLine}><span>Estimated Tax</span><strong>${tax.toFixed(2)}</strong></div>

            {discount > 0 && (
              <div className={`${styles.summaryLine} ${styles.discount}`}><span>Infrastructure Credit</span><strong>-${discount.toFixed(2)}</strong></div>
            )}

            <div className={styles.divider} />
            <div className={`${styles.summaryLine} ${styles.total}`}><span>Total</span><strong>${total.toFixed(2)}</strong></div>

            <button className={styles.checkoutBtn} onClick={() => setCheckoutStep(2)}>
              Initialize Checkout
            </button>

            <div className={styles.paymentIcons}>
                <img src="https://www.svgrepo.com/show/508726/visa.svg" alt="Visa" />
                <img src="https://www.svgrepo.com/show/508695/mastercard.svg" alt="Mastercard" />
                <img src="https://www.svgrepo.com/show/508710/paypal.svg" alt="Paypal" />
                <img src="https://www.svgrepo.com/show/365399/apple-pay-logo.svg" alt="Apple Pay" />
            </div>

            <div className={styles.benefits}>
              <div className={styles.benefit}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Encrypted Secure Checkout</span></div>
              <div className={styles.benefit}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Free Returns on All Items</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;