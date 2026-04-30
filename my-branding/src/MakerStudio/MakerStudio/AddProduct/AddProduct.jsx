import React, { useState, useRef } from 'react';
import styles from './AddProduct.module.css';

const AddProduct = ({ products, updateProduct, refreshProducts }) => {
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
  const [activeTab, setActiveTab] = useState('details');
  
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
    inventory: '10',
    status: 'draft'
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
    const newId = Math.max(...colorVariants.map(c => c.id)) + 1;
    setColorVariants(prev => [...prev, { id: newId, name: 'New Color', hex: '#888888', images: [] }]);
    setActiveColorId(newId);
  };

  // Update color variant
  const updateColorVariant = (id, field, value) => {
    setColorVariants(prev => prev.map(color => 
      color.id === id ? { ...color, [field]: value } : color
    ));
  };

  // Remove color variant
  const removeColorVariant = (id) => {
    if (colorVariants.length <= 1) return;
    setColorVariants(prev => prev.filter(color => color.id !== id));
    if (activeColorId === id) {
      setActiveColorId(colorVariants[0].id);
    }
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (status = 'active') => {
    setIsSubmitting(true);
    
    const productData = {
      ...formData,
      status,
      images,
      colorVariants,
      selectedSizes,
      price: parseFloat(formData.price) || 0,
      comparePrice: parseFloat(formData.comparePrice) || 0,
      inventory: parseInt(formData.inventory) || 0
    };

    console.log('Submitting product:', productData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      sku: '',
      category: '',
      tags: '',
      inventory: '10',
      status: 'draft'
    });
    setImages([]);
    setColorVariants([
      { id: 1, name: 'Black', hex: '#1a1a1a', images: [] },
      { id: 2, name: 'White', hex: '#ffffff', images: [] }
    ]);
    setSelectedSizes(['M', 'L']);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className={styles.container}>
      {showSuccess && (
        <div className={styles.successToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Product created successfully!
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'media' ? styles.active : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Media
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'variants' ? styles.active : ''}`}
          onClick={() => setActiveTab('variants')}
        >
          Variants
        </button>
      </div>

      <div className={styles.form}>
        <div className={styles.leftColumn}>
          {/* Product Details */}
          {activeTab === 'details' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3 className={styles.sectionTitle}>Product Information</h3>
                  <p className={styles.sectionDesc}>Basic details about your product</p>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Product Name *</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., 450GSM Heavyweight Tee"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product..."
                  rows={4}
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Price *</label>
                  <div className={styles.inputWithPrefix}>
                    <span className={styles.prefix}>$</span>
                    <input 
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Compare Price</label>
                  <div className={styles.inputWithPrefix}>
                    <span className={styles.prefix}>$</span>
                    <input 
                      type="number"
                      name="comparePrice"
                      value={formData.comparePrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>SKU</label>
                  <input 
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="e.g., TEE-001"
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
              </div>

              <div className={styles.inputGroup}>
                <label>Tags</label>
                <input 
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Comma separated tags"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Inventory</label>
                <input 
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleInputChange}
                  placeholder="10"
                />
              </div>
            </div>
          )}

          {/* Media */}
          {activeTab === 'media' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3 className={styles.sectionTitle}>Product Images</h3>
                  <p className={styles.sectionDesc}>Add up to 10 images for your product</p>
                </div>
              </div>

              <div className={styles.imageUpload} onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  hidden
                />
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p>Click to upload images</p>
                <span>PNG, JPG up to 10MB</span>
              </div>

              {images.length > 0 && (
                <div className={styles.imageGrid}>
                  {images.map(img => (
                    <div key={img.id} className={styles.imagePreview}>
                      <img src={img.preview} alt="Product" />
                      <button 
                        className={styles.removeImage}
                        onClick={() => removeImage(img.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Variants */}
          {activeTab === 'variants' && (
            <>
              {/* Colors */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>Color Variants</h3>
                    <p className={styles.sectionDesc}>Add different color options</p>
                  </div>
                  <button className={styles.addBtn} onClick={addColorVariant}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Color
                  </button>
                </div>

                <div className={styles.colorTabs}>
                  {colorVariants.map(color => (
                    <button
                      key={color.id}
                      className={`${styles.colorTab} ${activeColorId === color.id ? styles.active : ''}`}
                      onClick={() => setActiveColorId(color.id)}
                      style={{ '--color': color.hex }}
                    >
                      <span className={styles.colorSwatch} style={{ background: color.hex }} />
                      <input 
                        type="text"
                        value={color.name}
                        onChange={(e) => updateColorVariant(color.id, 'name', e.target.value)}
                        className={styles.colorName}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {colorVariants.length > 1 && (
                        <button 
                          className={styles.removeColor}
                          onClick={(e) => { e.stopPropagation(); removeColorVariant(color.id); }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      )}
                    </button>
                  ))}
                </div>

                {colorVariants.map(color => (
                  <div key={color.id} className={`${styles.colorSection} ${activeColorId === color.id ? styles.active : ''}`}>
                    <div className={styles.colorHeader}>
                      <input 
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateColorVariant(color.id, 'hex', e.target.value)}
                        className={styles.colorPicker}
                      />
                      <span>{color.name}</span>
                    </div>
                    
                    <div 
                      className={styles.colorImageUpload}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = (e) => handleColorImageUpload(e, color.id);
                        input.click();
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span>Add images for {color.name}</span>
                    </div>

                    {color.images.length > 0 && (
                      <div className={styles.imageGrid}>
                        {color.images.map(img => (
                          <div key={img.id} className={styles.imagePreview}>
                            <img src={img.preview} alt={color.name} />
                            <button 
                              className={styles.removeImage}
                              onClick={() => removeColorImage(color.id, img.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Sizes */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>Size Options</h3>
                    <p className={styles.sectionDesc}>Select available sizes</p>
                  </div>
                </div>

                <div className={styles.sizeGrid}>
                  {allSizes.map(size => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSizes.includes(size) ? styles.active : ''}`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column - Preview & Actions */}
        <div className={styles.rightColumn}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Preview</h3>
            <div className={styles.previewCard}>
              {images.length > 0 ? (
                <img src={images[0].preview} alt="Preview" className={styles.previewImage} />
              ) : (
                <div className={styles.previewPlaceholder}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
              <div className={styles.previewInfo}>
                <h4>{formData.name || 'Product Name'}</h4>
                <p className={styles.previewPrice}>
                  ${formData.price || '0'} 
                  {formData.comparePrice && <span className={styles.comparePrice}>${formData.comparePrice}</span>}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Status</h3>
            <div className={styles.statusOptions}>
              <label className={styles.statusOption}>
                <input 
                  type="radio" 
                  name="status" 
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleInputChange}
                />
                <span className={styles.statusDot} style={{ background: 'var(--brut-success)' }} />
                Active
              </label>
              <label className={styles.statusOption}>
                <input 
                  type="radio" 
                  name="status" 
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={handleInputChange}
                />
                <span className={styles.statusDot} style={{ background: '#666' }} />
                Draft
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.saveDraft}
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
            >
              Save as Draft
            </button>
            <button 
              className={styles.publish}
              onClick={() => handleSubmit('active')}
              disabled={isSubmitting || !formData.name || !formData.price}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
