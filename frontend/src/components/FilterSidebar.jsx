import React, { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import './FilterSidebar.css';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  products, 
  onFilterChange,
  filters,
  setFilters 
}) => {
  const [localFilters, setLocalFilters] = useState(filters || {
    sortBy: 'recommended',
    minPrice: 0,
    maxPrice: 10000,
    categories: [],
    productType: '',
    color: ''
  });

  // Obtener categorías únicas de los productos
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Obtener precio máximo
  const maxPrice = Math.max(...products.map(p => p.price || 0), 10000);

  useEffect(() => {
    setLocalFilters(filters || {
      sortBy: 'recommended',
      minPrice: 0,
      maxPrice: maxPrice,
      categories: [],
      productType: '',
      color: ''
    });
  }, [filters, maxPrice]);

  const handleSortChange = (value) => {
    const newFilters = { ...localFilters, sortBy: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryToggle = (category) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    
    const newFilters = { ...localFilters, categories: newCategories };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type, value) => {
    const newFilters = {
      ...localFilters,
      [type]: parseInt(value)
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleProductTypeChange = (type) => {
    const newFilters = { ...localFilters, productType: type };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      sortBy: 'recommended',
      minPrice: 0,
      maxPrice: maxPrice,
      categories: [],
      productType: '',
      color: ''
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <>
      {isOpen && <div className={`filter-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />}
      <div className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>
            <Filter size={20} />
            Filtros
          </h3>
          <button className="filter-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="filter-content">
          <div className="filter-section">
            <h4>Ordenar por</h4>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="recommended">Recomendado</option>
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
              <option value="price-asc">Precio Menor a Mayor</option>
              <option value="price-desc">Precio Mayor a Menor</option>
            </select>
          </div>

          <div className="filter-section">
            <h4>Rango de Precio</h4>
            <div className="price-range">
              <div className="price-input-group">
                <label>Mínimo: ${localFilters.minPrice}</label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={localFilters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                />
              </div>
              <div className="price-input-group">
                <label>Máximo: ${localFilters.maxPrice}</label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={localFilters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h4>Categorías</h4>
            <div className="category-filters">
              {categories.map(category => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={localFilters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Tipo de Producto</h4>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="productType"
                  value=""
                  checked={localFilters.productType === ''}
                  onChange={() => handleProductTypeChange('')}
                />
                <span>Todos</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="productType"
                  value="wholesale"
                  checked={localFilters.productType === 'wholesale'}
                  onChange={() => handleProductTypeChange('wholesale')}
                />
                <span>Con precio mayoreo</span>
              </label>
            </div>
          </div>

          <button className="btn btn-outline clear-filters-btn" onClick={clearFilters}>
            Limpiar Filtros
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;

