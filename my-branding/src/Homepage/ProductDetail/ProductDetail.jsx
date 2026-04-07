import React, { useState } from 'react';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ product, onBack, addToCart, isSaved, toggleSaved }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Matte Black');
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Matte Black', hex: '#000000' },
    { name: 'Lunar Grey', hex: '#2A2A2A' },
    { name: 'Paper Bone', hex: '#e1decc' }
  ];

  // Multiple shots of the product
  const productImages = [
    product.img,
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    "https://images.unsplash.com/photo-1574180563860-dc120042f485?w=600"
  ];
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Catalog
      </button>

      <div className={styles.productLayout}>
        {/* LEFT SIDE: Image Section (Sticky) */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img src={productImages[activeImg]} alt={product.title} />
          </div>
          
          {/* NEW: Multi-image thumbnails (AliExpress Style) */}
          <div className={styles.thumbnailGrid}>
            {productImages.map((img, idx) => (
              <div 
                key={idx} 
                className={`${styles.thumb} ${activeImg === idx ? styles.activeThumb : ''}`}
                onClick={() => setActiveImg(idx)}
              >
                <img src={img} alt="Shot" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Details Section */}
        <div className={styles.detailsSection}>
          <div className={styles.productHeader}>
            <div>
              <span className={styles.categoryTag}>NEW INFRASTRUCTURE</span>
              <h1 className={styles.productTitle}>{product.title}</h1>
            </div>
            <button 
              className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
              onClick={toggleSaved}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          <p className={styles.productPrice}>{product.price}</p>

          {/* NEW: Color Selection */}
          <div className={styles.selectorSection}>
            <h4 className={styles.selectorTitle}>Color: <span>{selectedColor}</span></h4>
            <div className={styles.colorGrid}>
              {colors.map((color) => (
                <button 
                  key={color.name}
                  className={`${styles.colorCircle} ${selectedColor === color.name ? styles.activeColor : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.name)}
                />
              ))}
            </div>
          </div>

          {/* Product Specs */}
          <div className={styles.productSpecs}>
            <div className={styles.specItem}><span className={styles.specLabel}>Composition</span><strong>100% Organic Cotton</strong></div>
            <div className={styles.specItem}><span className={styles.specLabel}>Weight</span><strong>Heavyweight (450 GSM)</strong></div>
            <div className={styles.specItem}><span className={styles.specLabel}>Origin</span><strong>Brutige Atelier</strong></div>
            <div className={styles.specItem}><span className={styles.specLabel}>Turnaround</span><strong>14 Working Days</strong></div>
          </div>

          {/* Size Selection */}
          <div className={styles.sizeSection}>
            <div className={styles.sizeHeader}>
              <h4>Select Size</h4>
              <button className={styles.sizeGuideBtn}>Size Guide</button>
            </div>
            <div className={styles.sizeGrid}>
              {sizes.map(size => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Message Maker */}
          <div className={styles.utilityRow}>
            <div className={styles.quantitySection}>
                <div className={styles.quantityControl}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
            </div>

            {/* NEW: Message Maker Button */}
            <button className={styles.messageBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
              Message Maker
            </button>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button 
              className={`${styles.addToCartBtn} ${addedToCart ? styles.added : ''}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? "Added to Loop" : "Add to Cart"}
            </button>
            <button className={styles.brandBtn}>
              Brand This Item
            </button>
          </div>

          {/* Features */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              <div><strong>Infrastructure Shipping</strong><p>Global fulfillment included</p></div>
            </div>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div><strong>Verified Maker</strong><p>Quality checked by Brutige Studio</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;