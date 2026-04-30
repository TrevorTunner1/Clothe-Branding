import React, { useState } from 'react';
import styles from './Products.module.css';

// HARDCODED MOCK DATA (Fallback to ensure visibility)
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: '450GSM Heavyweight Hoodie',
    price: 85.00,
    stock: 124,
    status: 'active',
    category: 'Hoodies',
    tags: ['Streetwear', 'Winter', 'Bestseller'],
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    name: 'Oversized Boxy Tee',
    price: 45.00,
    stock: 45,
    status: 'active',
    category: 'T-Shirts',
    tags: ['Summer', 'Cotton', 'New'],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    name: 'Cargo Utility Pants',
    price: 95.00,
    stock: 12,
    status: 'active',
    category: 'Pants',
    tags: ['Utility', 'Spring'],
    image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 4,
    name: 'Structured Dad Cap',
    price: 35.00,
    stock: 0,
    status: 'draft',
    category: 'Accessories',
    tags: ['Headwear', 'Logo'],
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 5,
    name: 'Zip-Up Track Jacket',
    price: 75.00,
    stock: 30,
    status: 'active',
    category: 'Jackets',
    tags: ['Sport', 'Retro'],
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 6,
    name: 'Essential Sweatpants',
    price: 65.00,
    stock: 8,
    status: 'draft',
    category: 'Pants',
    tags: ['Comfort', 'Loungewear'],
    image: 'https://images.unsplash.com/photo-1552975084-6e027cd345c9?w=500&auto=format&fit=crop&q=60'
  }
];

const Products = ({ products: parentProducts, updateProduct, refreshProducts }) => {
  // Use parent products if available, otherwise use hardcoded defaults
  const [allProducts, setAllProducts] = useState(parentProducts && parentProducts.length > 0 ? parentProducts : DEFAULT_PRODUCTS);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Local state for the edit form
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    status: 'active',
    category: '',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');

  // Sync with parent if data changes externally
  React.useEffect(() => {
    if (parentProducts && parentProducts.length > 0) {
      setAllProducts(parentProducts);
    }
  }, [parentProducts]);

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || product.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      status: product.status,
      category: product.category || 'General',
      tags: product.tags || []
    });
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setNewTag('');
  };

  const handleSave = async () => {
    const updatedData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    // Update local state immediately for UI feedback
    const updatedList = allProducts.map(p => 
      p.id === editingProduct ? { ...p, ...updatedData } : p
    );
    setAllProducts(updatedList);

    // Call parent update function if available
    if (updateProduct) {
      await updateProduct(editingProduct, updatedData);
    }
    
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedList = allProducts.filter(p => p.id !== id);
      setAllProducts(updatedList);
      if (refreshProducts) await refreshProducts();
    }
  };

  // Tag Management
  const addTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  return (
    <div className={styles.container}>
      {/* Header Controls */}
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search inventory..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.filters}>
          {['all', 'active', 'draft'].map(status => (
            <button 
              key={status}
              className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map(product => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  onError={(e) => {
                    // Fallback image if URL breaks
                    e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60';
                  }}
                />
                <span className={`${styles.badge} ${styles[product.status]}`}>
                  {product.status}
                </span>
                
                <div className={styles.overlay}>
                  <button onClick={() => handleEditClick(product)} className={styles.iconBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(product.id)} className={`${styles.iconBtn} ${styles.danger}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className={styles.info}>
                <div className={styles.top}>
                  <h3>{product.name}</h3>
                  <span className={styles.price}>${product.price.toFixed(2)}</span>
                </div>
                
                <div className={styles.meta}>
                  <span className={styles.stock}>{product.stock} in stock</span>
                  <span className={styles.category}>{product.category}</span>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className={styles.tags}>
                    {product.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                    {product.tags.length > 3 && <span className={styles.tagMore}>+{product.tags.length - 3}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>No products found matching your criteria.</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Product</h2>
              <button onClick={handleCloseModal} className={styles.closeBtn}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Stock Qty</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Tags</label>
                <div className={styles.tagInputWrapper}>
                  <input 
                    type="text" 
                    placeholder="Add a tag and press Enter"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTag(e)}
                  />
                  <button onClick={addTag} className={styles.addTagBtn}>+</button>
                </div>
                <div className={styles.tagsList}>
                  {formData.tags.map((tag, index) => (
                    <span key={index} className={styles.editTag}>
                      {tag}
                      <button onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button onClick={handleCloseModal} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSave} className={styles.saveBtn}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;