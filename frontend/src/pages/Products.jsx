import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { getProducts, searchProducts, filterProducts } from '../services/productsService';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import FilterSidebar from '../components/FilterSidebar';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: 'recommended',
    minPrice: 0,
    maxPrice: 10000,
    categories: [],
    productType: '',
    color: ''
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    } else {
      applyFilters();
    }
  }, [products, filters, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await getProducts();
      setProducts(allProducts);
      
      // Establecer precio máximo
      const maxPrice = Math.max(...allProducts.map(p => p.price || 0), 10000);
      setFilters(prev => ({
        ...prev,
        maxPrice
      }));
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      applyFilters();
      return;
    }

    try {
      const results = await searchProducts(term);
      const filtered = filterProducts(results, filters);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };

  const applyFilters = () => {
    const filtered = filterProducts(products, filters);
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="container">
          <h1>Catálogo de Productos</h1>
          <div className="products-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!e.target.value) {
                    applyFilters();
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchTerm);
                  }
                }}
              />
            </div>
          </div>
          <p className="products-count">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="products-content">
        <FilterSidebar
          isOpen={true}
          onClose={() => {}}
          products={products}
          filters={filters}
          onFilterChange={handleFilterChange}
          setFilters={setFilters}
        />

        <div className="products-grid-container">
          <div className="container">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No se encontraron productos</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      sortBy: 'recommended',
                      minPrice: 0,
                      maxPrice: Math.max(...products.map(p => p.price || 0), 10000),
                      categories: [],
                      productType: '',
                      color: ''
                    });
                  }}
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Products;

