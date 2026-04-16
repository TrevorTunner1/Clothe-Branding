import React, { useState, useRef } from 'react';
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [colorVariants, setColorVariants] = useState([
    { id: 1, name: 'Black', hex: '#1a1a1a', images: [] },
    { id: 2, name: 'White', hex: '#ffffff', images: [] }
  ]);
  const [activeColorId, setActiveColorId] = useState(1);
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL']);
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef(null);
  const colorFileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    sku: '',
    category: '',
    tags: '',
    inventory: '10'
  });

  const categories = [
    'T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets', 
    'Pants', 'Accessories', 'Footwear', 'Other'
  ];

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  // Handle main image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 10));
  };

  // Handle color variant image upload
  const handleColorImageUpload = (e, colorId) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setColorVariants(prev => prev.map(color => 
      color.id === colorId 
        ? { ...color, images: [...color.images, ...newImages].slice(0, 5) }
        : color
    ));
  };

  // Remove image
  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Remove color variant image
  const removeColorImage = (colorId, imageId) => {
    setColorVariants(prev => prev.map(color => 
      color.id === colorId 
        ? { ...color, images: color.images.filter(img => img.id !== imageId) }
        : color
    ));
  };

  // Add new color variant
  const addColorVariant = () => {
    const newId = Math.max(...colorVariants.map(c => c.id), 0) + 1;
    setColorVariants(prev => [...prev, { 
      id: newId, 
      name: `Color ${newId}`, 
      hex: '#808080',
      images: [] 
    }]);
    setActiveColorId(newId);
  };

  // Remove color variant
  const removeColorVariant = (colorId) => {
    if (colorVariants.length > 1) {
      setColorVariants(prev => prev.filter(c => c.id !== colorId));
      if (activeColorId === colorId) {
        setActiveColorId(colorVariants.find(c => c.id !== colorId)?.id);
      }
    }
  };

  // Update color
  const updateColor = (colorId, field, value) => {
    setColorVariants(prev => prev.map(color => 
      color.id === colorId ? { ...color, [field]: value } : color
    ));
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setImages([]);
      setColorVariants([
        { id: 1, name: 'Black', hex: '#1a1a1a', images: [] },
        { id: 2, name: 'White', hex: '#ffffff', images: [] }
      ]);
      setFormData({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        sku: '',
        category: '',
        tags: '',
        inventory: '10'
      });
    }, 2000);
  };

  const activeColor = colorVariants.find(c => c.id === activeColorId);

  return (
    <div className={styles.container}>
      {/* Success Toast */}
      {showSuccess && (
        <div className={styles.successToast}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>Product created successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Left Column - Images */}
        <div className={styles.leftColumn}>
          {/* Main Images Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Product Images</h3>
            <p className={styles.sectionDesc}>Upload up to 10 images. First image will be the cover.</p>
            
            <div className={styles.imageGrid}>
              {images.map((img, index) => (
                <div key={img.id} className={`${styles.imageCard} ${index === 0 ? styles.coverImage : ''}`}>
                  <img src={img.preview} alt={`Product ${index + 1}`} />
                  {index === 0 && <span className={styles.coverBadge}>COVER</span>}
                  <button 
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeImage(img.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
              
              {images.length < 10 && (
                <button 
                  type="button"
                  className={styles.uploadCard}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Add Image</span>
                </button>
              )}
            </div>
            
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={styles.hiddenInput}
            />
          </div>

          {/* Color Variants Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Color Variants</h3>
                <p className={styles.sectionDesc}>Add different colors with their own images.</p>
              </div>
              <button 
                type="button"
                className={styles.addBtn}
                onClick={addColorVariant}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Color
              </button>
            </div>

            {/* Color Tabs */}
            <div className={styles.colorTabs}>
              {colorVariants.map(color => (
                <button
                  key={color.id}
                  type="button"
                  className={`${styles.colorTab} ${activeColorId === color.id ? styles.activeTab : ''}`}
                  onClick={() => setActiveColorId(color.id)}
                >
                  <span 
                    className={styles.colorDot}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={styles.colorName}>{color.name}</span>
                  {colorVariants.length > 1 && (
                    <span 
                      className={styles.removeColor}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColorVariant(color.id);
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Active Color Editor */}
            {activeColor && (
              <div className={styles.colorEditor}>
                <div className={styles.colorInputs}>
                  <div className={styles.inputGroup}>
                    <label>Color Name</label>
                    <input 
                      type="text"
                      value={activeColor.name}
                      onChange={(e) => updateColor(activeColor.id, 'name', e.target.value)}
                      placeholder="e.g., Midnight Black"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Color Code</label>
                    <div className={styles.colorInputWrapper}>
                      <input 
                        type="color"
                        value={activeColor.hex}
                        onChange={(e) => updateColor(activeColor.id, 'hex', e.target.value)}
                      />
                      <span>{activeColor.hex}</span>
                    </div>
                  </div>
                </div>

                {/* Color Images */}
                <div className={styles.colorImagesGrid}>
                  {activeColor.images.map((img, idx) => (
                    <div key={img.id} className={styles.colorImageCard}>
                      <img src={img.preview} alt={`${activeColor.name} ${idx + 1}`} />
                      <button 
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeColorImage(activeColor.id, img.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {activeColor.images.length < 5 && (
                    <button 
                      type="button"
                      className={styles.uploadCardSmall}
                      onClick={() => colorFileInputRef.current?.click()}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  )}
                </div>

                <input 
                  ref={colorFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleColorImageUpload(e, activeColor.id)}
                  className={styles.hiddenInput}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className={styles.rightColumn}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Product Details</h3>
            
            <div className={styles.formGrid}>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Product Name *</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., 450GSM Heavyweight Tee"
                  required
                />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product..."
                  rows={4}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Price *</label>
                <div className={styles.priceInput}>
                  <span>$</span>
                  <input 
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="89.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Compare at Price</label>
                <div className={styles.priceInput}>
                  <span>$</span>
                  <input 
                    type="number"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleInputChange}
                    placeholder="120.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>SKU</label>
                <input 
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="BRUT-001"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Inventory</label>
                <input 
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleInputChange}
                  placeholder="10"
                  min="0"
                />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Tags (comma separated)</label>
                <input 
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="heavyweight, oversized, streetwear"
                />
              </div>
            </div>
          </div>

          {/* Sizes Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Available Sizes</h3>
            <div className={styles.sizesGrid}>
              {allSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  className={`${styles.sizeBtn} ${selectedSizes.includes(size) ? styles.selected : ''}`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting || !formData.name || !formData.price}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                Creating Product...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;