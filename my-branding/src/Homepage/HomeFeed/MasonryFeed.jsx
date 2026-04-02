import React, { useState } from 'react';
import styles from './MasonryFeed.module.css';

const MasonryFeed = ({ onSelect, savedItems = [], toggleSaved, addToCart }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const products = [
    { 
      id: 1, 
      title: "Oversized 'Brut' Tee", 
      price: "$45.00", 
      category: "Essentials",
      description: "Heavyweight 300GSM organic cotton with a boxy architectural silhouette.",
      img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500" 
    },
    { 
      id: 2, 
      title: "Infrastructure Hoodie", 
      price: "$85.00", 
      category: "Layering",
      description: "450GSM French Terry. Double-stitched seams for maximum structural integrity.",
      img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500" 
    },
    { 
      id: 3, 
      title: "Architectural Coat", 
      price: "$210.00", 
      category: "Outerwear",
      description: "Wool-blend minimalist overcoat featuring hidden hardware and sharp lines.",
      img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500" 
    },
    { 
      id: 4, 
      title: "Minimalist Shell", 
      price: "$120.00", 
      category: "Layering",
      description: "Water-resistant technical membrane designed for modular urban environments.",
      img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500" 
    },
    { 
      id: 5, 
      title: "Essential Cargo", 
      price: "$95.00", 
      category: "Bottoms",
      description: "Twill utility pants with articulated knees and discreet branding nodes.",
      img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500" 
    },
    { 
      id: 6, 
      title: "Technical Vest", 
      price: "$135.00", 
      category: "Layering",
      description: "Multi-pocket tactical layer with breathable mesh lining and raw edges.",
      img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500" 
    },
    { 
      id: 7, 
      title: "Structured Button-Up", 
      price: "$75.00", 
      category: "Essentials",
      description: "Crisp poplin cotton with a reinforced collar and minimalist hidden buttons.",
      img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500" 
    },
    { 
      id: 8, 
      title: "Heavy Sweatpants", 
      price: "$65.00", 
      category: "Bottoms",
      description: "Elastic-free hem and high-density fleece for a drape-heavy finish.",
      img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500" 
    },
    { 
      id: 9, 
      title: "Raw Denim Blueprint", 
      price: "$150.00", 
      category: "Bottoms",
      description: "14oz selvedge denim. Unwashed, deep indigo, engineered for longevity.",
      img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500" 
    },
    { 
      id: 10, 
      title: "Modular Tech Jacket", 
      price: "$280.00", 
      category: "Outerwear",
      description: "Removable sleeves and GORE-TEX lining. The peak of infrastructure design.",
      img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" 
    },
    { 
      id: 11, 
      title: "Artisan Linen Shirt", 
      price: "$90.00", 
      category: "Essentials",
      description: "Lightweight breathable linen, garment-dyed for a soft, worn-in prestige feel.",
      img: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=500" 
    },
    { 
      id: 12, 
      title: "Urban Utility Bag", 
      price: "$55.00", 
      category: "Accessories",
      description: "Ballistic nylon construction with weather-proof zippers and logo branding.",
      img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" 
    },
  ];

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1, 'M');
  };

  const handleToggleSaved = (e, product) => {
    e.stopPropagation();
    toggleSaved(product);
  };

  const isSaved = (productId) => {
    return savedItems?.some(item => item.id === productId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroText}>
          something comfy, large and modest,
        </h1>
        <p className={styles.heroSubtext}>
          Archived templates for the next generation of global fashion houses.
        </p>
      </div>

      <div className={styles.masonry}>
        {products.map(product => (
          <div 
            key={product.id} 
            className={styles.card}
            onMouseEnter={() => setHoveredCard(product.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelect(product)}
          >
            {/* Soft Container for the Image */}
            <div className={styles.imageContainer}>
              <div className={styles.imageInner}>
                <img src={product.img} alt={product.title} />
                
                {/* Visual Metadata Overlay */}
                <span className={styles.categoryTag}>{product.category}</span>

                <div className={`${styles.cardActions} ${hoveredCard === product.id ? styles.visible : ''}`}>
                  <button 
                    className={`${styles.actionBtn} ${isSaved(product.id) ? styles.saved : ''}`}
                    onClick={(e) => handleToggleSaved(e, product)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                  <button 
                    className={styles.actionBtn}
                    onClick={(e) => handleQuickAdd(e, product)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Information Container */}
            <div className={styles.cardDetails}>
              <div className={styles.productHeader}>
                <h4>{product.title}</h4>
                <div className={styles.pricePill}>{product.price}</div>
              </div>
              <p className={styles.descriptionText}>{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryFeed;